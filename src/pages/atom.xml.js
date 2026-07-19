import { Feed } from 'feed';
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

// Co-located post images only exist in the build as processed /_astro/ assets,
// so the feed has to run them through the image pipeline to get valid URLs.
const imageImporters = import.meta.glob('/src/content/blog/**/*.{jpeg,jpg,png,gif,webp,svg,avif}');

async function resolvePostImage(postDir, src) {
    const key = `${postDir}/${src.replace(/^\.\//, '')}`;
    const importer = imageImporters[key];
    if (!importer) return null;
    const mod = await importer();
    const processed = await getImage({ src: mod.default });
    return processed.src;
}

export async function GET(context) {
    const posts = await getCollection('blog');

    // Sort posts by date descending
    posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

    // Astro's context.site is a URL object, stringify and strip any trailing slash
    const siteUrl = context.site ? context.site.toString() : 'https://blog.patrickmeenan.com';
    const baseUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;

    const feed = new Feed({
        title: "Patrick Meenan's Blog",
        description: "Patrick Meenan's technical blog",
        id: baseUrl,
        link: baseUrl,
        language: "en",
        image: `${baseUrl}/favicon.png`,
        favicon: `${baseUrl}/favicon.png`,
        copyright: `All rights reserved ${new Date().getFullYear()}, Patrick Meenan`,
        updated: posts[0]?.data.date || new Date(),
        generator: "Astro via Feed",
        author: {
            name: "Patrick Meenan",
            link: `${baseUrl}/about`
        }
    });

    for (const post of posts) {
        const url = `${baseUrl}/${post.id}`;
        const postDir = '/' + post.filePath.replace(/\\/g, '/').split('/').slice(0, -1).join('/');

        // Feed readers resolve relative URLs against the feed location, not the
        // post, so every URL in the content needs to be absolute.
        const absolutize = (href) => {
            if (!href || /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//') || href.startsWith('#')) {
                return href;
            }
            return new URL(href, `${url}/`).toString();
        };

        const rendered = parser.render(post.body);

        // Map each co-located image to its processed /_astro/ URL (the raw
        // originals are never deployed).
        const imageMap = {};
        for (const match of rendered.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)) {
            const src = match[1];
            if (imageMap[src] !== undefined || /^([a-z][a-z0-9+.-]*:|\/)/i.test(src)) continue;
            const resolved = await resolvePostImage(postDir, src);
            imageMap[src] = resolved ? `${baseUrl}${resolved}` : absolutize(src);
        }

        // Parse the raw markdown into HTML and safely sanitize it
        const htmlContent = sanitizeHtml(rendered, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'pre', 'code', 'figure', 'figcaption']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: ['src', 'alt', 'title', 'width', 'height'],
                code: ['class'],
                pre: ['class']
            },
            transformTags: {
                img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, src: imageMap[attribs.src] ?? absolutize(attribs.src) } }),
                a: (tagName, attribs) => ({ tagName, attribs: { ...attribs, href: absolutize(attribs.href) } })
            }
        });

        feed.addItem({
            title: post.data.title,
            id: url,
            link: url,
            content: htmlContent,
            author: [
                {
                    name: "Patrick Meenan",
                    link: `${baseUrl}/about`
                }
            ],
            date: post.data.date,
        });
    }

    return new Response(feed.atom1(), {
        headers: {
            'Content-Type': 'application/atom+xml; charset=utf-8'
        }
    });
}
