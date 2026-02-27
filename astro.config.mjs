import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import rehypeMermaid from 'rehype-mermaid';
import { visit } from 'unist-util-visit';

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
    rehypePlugins: [rehypeFigureFromTitle, rehypeMermaid],
  },
  image: {
    service: {
      entrypoint: './src/image-service.mjs',
      config: {
        limitInputPixels: false
      }
    }
  }
});