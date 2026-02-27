import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            await walk(fullPath);
        } else if (/\.(png|jpeg|jpg|gif|webp)$/i.test(fullPath)) {
            try {
                await sharp(fullPath).metadata();
            } catch (e) {
                console.log(`Deleting corrupt image ${fullPath}`);
                fs.unlinkSync(fullPath);
                const mdPath = path.join(path.dirname(fullPath), 'index.md');
                if (fs.existsSync(mdPath)) {
                    let content = fs.readFileSync(mdPath, 'utf8');
                    content = content.replace(new RegExp(`!\\[[^\\]]*\\]\\(\\.\\/${file}\\)`, 'g'), '');
                    content = content.replace(new RegExp(`<img[^>]*src="\\.\\/${file}"[^>]*>`, 'g'), '');
                    fs.writeFileSync(mdPath, content);
                    console.log(`Removing references to ${file} in ${mdPath}`);
                }
            }
        }
    }
}

walk('src/content/blog').then(() => console.log('Done!')).catch(console.error);
