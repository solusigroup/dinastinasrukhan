<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageCompressionService
{
    /**
     * Process an uploaded image:
     * 1. High-resolution compressed image for enlarged modal view (max 1600px, 82% quality).
     * 2. Square 300x300 compressed thumbnail for the 3cm x 3cm mosaic grid.
     *
     * @param UploadedFile $file
     * @return array{photo_path: string, thumbnail_path: string}
     */
    public function processMosaicImage(UploadedFile $file): array
    {
        $realPath = $file->getRealPath();
        $mime = $file->getMimeType();

        // Load image resource using GD
        $sourceImage = match ($mime) {
            'image/jpeg', 'image/jpg' => @imagecreatefromjpeg($realPath),
            'image/png' => @imagecreatefrompng($realPath),
            'image/webp' => @imagecreatefromwebp($realPath),
            default => null,
        };

        if (!$sourceImage) {
            // Fallback: just store the original file if GD cannot process
            $fallbackPath = $file->store('mosaics', 'public');
            return [
                'photo_path' => $fallbackPath,
                'thumbnail_path' => $fallbackPath,
            ];
        }

        // Auto-fix EXIF orientation if available
        $sourceImage = $this->fixOrientation($sourceImage, $realPath, $mime);

        $width = imagesx($sourceImage);
        $height = imagesy($sourceImage);

        // Ensure directories exist
        Storage::disk('public')->makeDirectory('mosaics');
        Storage::disk('public')->makeDirectory('mosaics/thumbnails');

        $baseName = Str::random(32);

        // 1. Process enlarged / full view photo (max 1600px)
        $photoRelPath = "mosaics/{$baseName}.webp";
        $photoFullPath = Storage::disk('public')->path($photoRelPath);
        $this->resizeAndSave($sourceImage, $width, $height, 1600, 1600, false, $photoFullPath, 82);

        // 2. Process square thumbnail (300x300 center crop for 3cm x 3cm grid)
        $thumbRelPath = "mosaics/thumbnails/{$baseName}_thumb.webp";
        $thumbFullPath = Storage::disk('public')->path($thumbRelPath);
        $this->cropSquareAndSave($sourceImage, $width, $height, 300, $thumbFullPath, 75);

        imagedestroy($sourceImage);

        return [
            'photo_path' => $photoRelPath,
            'thumbnail_path' => $thumbRelPath,
        ];
    }

    /**
     * Auto-fix EXIF orientation for JPEG images.
     */
    private function fixOrientation($image, string $path, string $mime)
    {
        if (!in_array($mime, ['image/jpeg', 'image/jpg']) || !function_exists('exif_read_data')) {
            return $image;
        }

        try {
            $exif = @exif_read_data($path);
            if (!empty($exif['Orientation'])) {
                switch ($exif['Orientation']) {
                    case 3:
                        $rotated = imagerotate($image, 180, 0);
                        imagedestroy($image);
                        return $rotated;
                    case 6:
                        $rotated = imagerotate($image, -90, 0);
                        imagedestroy($image);
                        return $rotated;
                    case 8:
                        $rotated = imagerotate($image, 90, 0);
                        imagedestroy($image);
                        return $rotated;
                }
            }
        } catch (\Throwable $e) {
            // ignore exif errors
        }

        return $image;
    }

    /**
     * Resize image proportionally within max bounding box and save as WebP (fallback to JPEG).
     */
    private function resizeAndSave($source, int $origW, int $origH, int $maxW, int $maxH, bool $crop, string $destPath, int $quality): void
    {
        $ratio = min($maxW / $origW, $maxH / $origH);
        if ($ratio >= 1) {
            $newW = $origW;
            $newH = $origH;
        } else {
            $newW = (int) round($origW * $ratio);
            $newH = (int) round($origH * $ratio);
        }

        $dest = imagecreatetruecolor($newW, $newH);

        // Preserve alpha transparency
        imagealphablending($dest, false);
        imagesavealpha($dest, true);

        imagecopyresampled($dest, $source, 0, 0, 0, 0, $newW, $newH, $origW, $origH);

        if (function_exists('imagewebp')) {
            imagewebp($dest, $destPath, $quality);
        } else {
            imagejpeg($dest, $destPath, $quality);
        }

        imagedestroy($dest);
    }

    /**
     * Crop image to 1:1 square from center and resize to target dimension.
     */
    private function cropSquareAndSave($source, int $origW, int $origH, int $targetSize, string $destPath, int $quality): void
    {
        $minSide = min($origW, $origH);
        $srcX = (int) round(($origW - $minSide) / 2);
        $srcY = (int) round(($origH - $minSide) / 2);

        $dest = imagecreatetruecolor($targetSize, $targetSize);

        // Preserve alpha transparency
        imagealphablending($dest, false);
        imagesavealpha($dest, true);

        imagecopyresampled($dest, $source, 0, 0, $srcX, $srcY, $targetSize, $targetSize, $minSide, $minSide);

        if (function_exists('imagewebp')) {
            imagewebp($dest, $destPath, $quality);
        } else {
            imagejpeg($dest, $destPath, $quality);
        }

        imagedestroy($dest);
    }
}
