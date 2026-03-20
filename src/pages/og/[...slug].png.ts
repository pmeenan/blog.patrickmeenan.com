import { getCollection } from 'astro:content';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

export async function GET({ props }: any) {
  const { post } = props;
  const { remarkPluginFrontmatter } = await post.render();
  let heroImage = remarkPluginFrontmatter?.heroImage;
  
  if (!heroImage) {
    return new Response(null, { status: 404 });
  }

  // Resolve the image path
  const postDir = post.id.includes('/') ? post.id.replace(/\/[^/]+$/, '') : '';
  const resolvedPath = postDir 
    ? `src/content/blog/${postDir}/${heroImage.replace(/^.\//, '')}`
    : `src/content/blog/${heroImage.replace(/^.\//, '')}`;

  const absolutePath = path.resolve(process.cwd(), resolvedPath);

  try {
    const imageBuffer = await fs.readFile(absolutePath);
    
    // Get dominant color
    const stats = await sharp(imageBuffer).stats();
    const dominantColor = stats.dominant;

    const paddedImage = await sharp(imageBuffer)
      .resize({
        width: 1200,
        height: 630, // Updated to 630 based on user feedback
        fit: 'contain',
        background: dominantColor
      })
      .png()
      .toBuffer();

    return new Response(paddedImage as unknown as BodyInit, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (e) {
    console.error(`Error generating OG image for ${post.id}:`, e);
    return new Response(null, { status: 404 });
  }
}
