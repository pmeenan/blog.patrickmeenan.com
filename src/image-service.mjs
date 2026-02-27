import { baseService } from 'astro/assets';
import sharp from 'sharp';

const qualityTable = {
    low: 25,
    mid: 50,
    high: 80,
    max: 100,
};

export default {
    ...baseService,
    validateOptions(options, imageConfig) {
        const validOptions = baseService.validateOptions ? baseService.validateOptions(options, imageConfig) : options;
        validOptions.format = 'jpeg';
        validOptions.quality = 85;
        return validOptions;
    },
    async transform(inputBuffer, transformOptions, config) {
        const transform = sharp(inputBuffer, { failOn: 'none', animated: false });

        transform.rotate(); // preserve EXIF orientation

        let width = transformOptions.width;
        let height = transformOptions.height;
        let quality = 85;
        let format = 'jpeg';

        // Always force JPEG format and quality 85 for blog requirements
        if (transformOptions.quality && typeof transformOptions.quality === 'number') {
            quality = transformOptions.quality;
        } else if (transformOptions.quality && typeof transformOptions.quality === 'string' && qualityTable[transformOptions.quality]) {
            quality = qualityTable[transformOptions.quality];
        }

        transform.resize({
            width: width && width < 1280 ? Math.round(width) : 1280,
            height: height && height < 1280 ? Math.round(height) : 1280,
            fit: 'inside', // Maintains aspect ratio within the 1280x1280 box
            withoutEnlargement: true,
        });

        transform.toFormat(format, { quality });

        const { data, info } = await transform.toBuffer({ resolveWithObject: true });

        return {
            data,
            format: info.format,
        };
    },
};
