import fs from "fs";
import sharp from "sharp";

/**
 * Delete a file from the file system if it exists.
 *
 * @param filePath - Absolute or relative path to the file.
 *
 * @example
 * deleteFileIfExists("uploads/temp.jpg");
 *
 * @remarks
 * - This function is asynchronous but uses a callback pattern.
 * - Useful for cleaning up temporary uploads after processing.
 */
export function deleteFileIfExists(filePath: string): void {
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("❌ Failed to delete file:", unlinkErr);
        } else {
          console.log("✅ File deleted:", filePath);
        }
      });
    }
  });
}

/**
 * Optimize and convert an image buffer to WebP format.
 *
 * @param buffer - The original image buffer.
 * @param format - Target image format (default is 'image/webp').
 * @returns A Promise resolving to an object containing the optimized buffer and format.
 *
 * @example
 * const { buffer, format } = await optimizeImage(file.buffer);
 *
 * @remarks
 * - This function resizes the image to a max width of 800px while preserving aspect ratio.
 * - WebP format is used for better compression and performance.
 */
export const optimizeImage = async (
  buffer: Buffer,
  format: string = "image/webp"
): Promise<{ buffer: Buffer; format: string }> => {
  const image = sharp(buffer).resize({ width: 800 });

  const webpBuffer = await image.webp({ quality: 80 }).toBuffer();

  return {
    buffer: webpBuffer,
    format,
  };
};
