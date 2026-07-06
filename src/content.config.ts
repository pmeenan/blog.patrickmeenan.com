import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
    loader: glob({
        pattern: '**/index.md',
        base: './src/content/blog',
        generateId: ({ entry }) => {
            return entry.replace(/\/index\.md$/, '');
        }
    }),
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        originalUrl: z.string().url().optional(),
        heroImage: z.string().optional(),
    }),
});

export const collections = {
    blog: blogCollection,
};
