import { getCollection, render } from 'astro:content';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

export async function GET({ props }: any) {
  const { post } = props;
  const { remarkPluginFrontmatter } = await render(post);
  let heroImage = remarkPluginFrontmatter?.heroImage;
  
  if (!heroImage) {
    return new Response(null, { status: 404 });
  }

  // Resolve the image path using post.filePath
  const absolutePath = path.resolve(process.cwd(), path.dirname(post.filePath), heroImage);

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
