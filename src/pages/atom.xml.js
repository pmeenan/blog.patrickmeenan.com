import { Feed } from 'feed';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

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

    posts.forEach(post => {
        const url = `${baseUrl}/${post.id}`;

        // Parse the raw markdown into HTML and safely sanitize it
        const htmlContent = sanitizeHtml(parser.render(post.body), {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'pre', 'code', 'figure', 'figcaption']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: ['src', 'alt', 'title', 'width', 'height'],
                code: ['class'],
                pre: ['class']
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
    });

    return new Response(feed.atom1(), {
        headers: {
            'Content-Type': 'application/atom+xml; charset=utf-8'
        }
    });
}
