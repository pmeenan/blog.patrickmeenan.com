import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import rehypeMermaid from 'rehype-mermaid';
import { visit } from 'unist-util-visit';
import { remarkExtractMetadata } from './src/utils/remarkExtractMetadata.mjs';

function rehypeFigureFromTitle() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'img' && node.properties && node.properties.title) {
        const figure = {
          type: 'element',
          tagName: 'figure',
          properties: {
            class: 'flex flex-col items-center my-10'
          },
          children: [
            node,
            {
              type: 'element',
              tagName: 'figcaption',
              properties: {
                class: 'text-center text-sm text-slate-500 dark:text-slate-400 mt-2 italic'
              },
              children: [{ type: 'text', value: node.properties.title }]
            }
          ]
        };
        parent.children[index] = figure;
      }
    });
  };
}

import fs from 'fs';
import path from 'path';

function removeLazyLoadingIntegration() {
  return {
    name: 'remove-lazy-loading',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const fileURLToPath = (await import('url')).fileURLToPath;
        const distDir = fileURLToPath(dir);
        
        const walkSync = (dir, filelist = []) => {
          fs.readdirSync(dir).forEach(file => {
            filelist = fs.statSync(path.join(dir, file)).isDirectory()
              ? walkSync(path.join(dir, file), filelist)
              : filelist.concat(path.join(dir, file));
          });
          return filelist;
        };

        const htmlFiles = walkSync(distDir).filter(f => f.endsWith('.html'));
        for (const file of htmlFiles) {
          let content = fs.readFileSync(file, 'utf8');
          if (content.includes('loading="lazy"')) {
            content = content.replace(/loading="lazy"/, 'loading="eager"');
            fs.writeFileSync(file, content, 'utf8');
          }
        }
      }
    }
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.patrickmeenan.com',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
      langs: ['bash', 'javascript', 'html', 'c', 'cpp', 'java', 'json'],
    },
    remarkPlugins: [remarkExtractMetadata],
    rehypePlugins: [rehypeFigureFromTitle, rehypeMermaid],
  },
  integrations: [sitemap(), removeLazyLoadingIntegration()],
  image: {
    service: {
      entrypoint: './src/image-service.mjs',
      config: {
        limitInputPixels: false
      }
    }
  }
});