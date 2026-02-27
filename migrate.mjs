import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import TurndownService from 'turndown';
import { JSDOM } from 'jsdom';
import { URL } from 'url';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

const feedUrl = 'https://blog.patrickmeenan.com/feeds/posts/default?alt=json&max-results=500';

async function fetchFeed() {
  return new Promise((resolve, reject) => {
    https.get(feedUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
      file.on('error', err => {
        fs.unlink(dest, () => reject(err));
      });
    }).on('error', err => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function migrate() {
  const feed = await fetchFeed();
  const entries = feed.feed.entry || [];
  let redirects = '';
  
  ensureDir('src/content/blog');
  
  console.log(`Found ${entries.length} posts`);
  
  for (const entry of entries) {
    const title = entry.title.$t;
    const published = entry.published.$t; // e.g., 2014-09-25T10:55:00.001-04:00
    let contentHtml = entry.content ? entry.content.$t : '';
    
    if (!contentHtml && entry.summary) {
        contentHtml = entry.summary.$t;
    }
    
    const link = entry.link.find(l => l.rel === 'alternate' && l.type === 'text/html');
    if (!link) continue;
    
    const origUrl = new URL(link.href);
    let postSlug = origUrl.pathname.split('/').pop().replace(/\.html$/, '') || 'index';
    
    const dateObj = new Date(published);
    const yyyy = dateObj.getFullYear().toString();
    const mm = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const dd = dateObj.getDate().toString().padStart(2, '0');
    
    const postDir = path.join('src', 'content', 'blog', yyyy, mm, dd, postSlug);
    ensureDir(postDir);
    
    const dom = new JSDOM(contentHtml);
    const document = dom.window.document;
    
    const images = Array.from(document.querySelectorAll('img'));
    let imgCounter = 1;
    
    for (const img of images) {
      const parentTag = img.parentElement;
      let targetUrl = img.src;
      
      let isWrappedInImageLink = false;
      if (parentTag && parentTag.tagName === 'A' && parentTag.href.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
          targetUrl = parentTag.href;
          isWrappedInImageLink = true;
      }
      
      if (targetUrl.startsWith('//')) targetUrl = 'https:' + targetUrl;
      else if (targetUrl.startsWith('/')) targetUrl = origUrl.origin + targetUrl;
      
      let parsedUrl;
      try {
        parsedUrl = new URL(targetUrl);
      } catch (e) {
        console.warn(`Invalid URL: ${targetUrl}`);
        continue;
      }
      
      let ext = path.extname(parsedUrl.pathname);
      if (!ext) ext = '.jpg';
      const localFilename = `image-${imgCounter++}${ext}`;
      const localPath = path.join(postDir, localFilename);
      
      try {
        console.log(`Downloading ${targetUrl}...`);
        await downloadImage(targetUrl, localPath);
        
        img.src = `./${localFilename}`;
        if (isWrappedInImageLink) {
            parentTag.parentNode.replaceChild(img, parentTag);
        }
      } catch (e) {
        console.error(`Failed to download ${targetUrl}:`, e.message);
      }
    }
    
    const emptyElements = document.querySelectorAll('div:empty, span:empty');
    emptyElements.forEach(el => el.remove());
    
    let markdown = turndownService.turndown(document.body.innerHTML);
    
    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: ${published}
originalUrl: ${origUrl.href}
---

`;
    fs.writeFileSync(path.join(postDir, 'index.md'), frontmatter + markdown);
    
    const newPath = `/${yyyy}/${mm}/${dd}/${postSlug}`;
    redirects += `rewrite ^${origUrl.pathname}$ ${newPath} permanent;\n`;
    console.log(`Migrated ${title}`);
  }
  fs.writeFileSync('nginx_redirects.conf', redirects);
  console.log('Migration complete');
}

migrate().catch(console.error);
