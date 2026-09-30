/**
 * Client-side image compressor utility using HTML5 Canvas.
 * Compresses large camera photos before uploading to server.
 */

interface CompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
}

export async function compressImage(
    file: File,
    options: CompressionOptions = {},
): Promise<File> {
    const {
        maxWidth = 1920,
        maxHeight = 1920,
        quality = 0.85,
    } = options;

    // If file is SVG or GIF, don't compress through canvas to avoid losing animation or vector info
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        return file;
    }

    return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            let { width, height } = img;

            // Calculate new dimensions
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                // Canvas context not supported, return original file
                return resolve(file);
            }

            // High-quality downsampling
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // Determine output mime type (prefer webp, fallback to jpeg)
            const outputMime = 'image/webp';

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        return resolve(file);
                    }

                    // If compressed blob is somehow larger than original (rare), return original
                    if (blob.size >= file.size) {
                        return resolve(file);
                    }

                    const originalExt = file.name.substring(file.name.lastIndexOf('.'));
                    const newFileName = file.name.replace(originalExt, '.webp');

                    const compressedFile = new File([blob], newFileName, {
                        type: outputMime,
                        lastModified: Date.now(),
                    });

                    resolve(compressedFile);
                },
                outputMime,
                quality,
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(file);
        };

        img.src = objectUrl;
    });
}
