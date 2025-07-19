import fs from "fs";
import sharp from "sharp";

export function deleteFileIfExists(filePath: string) {
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

// const s3Client = new S3Client({
//   region: REGION,
//   credentials: {
//     accessKeyId: ACCESSKEYID || "",
//     secretAccessKey: SECRETACCESSKEY || "",
//   },
//   requestHandler: new NodeHttpHandler({
//     connectionTimeout: 5000, // مهلة إنشاء الاتصال (5 ثواني)
//     socketTimeout: 10000, // مهلة تلقي الاستجابة (10 ثواني)
//   }),
// });

// const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

// const ALLOWED_TYPES = [
//   "application/pdf",
//   "image/jpeg",
//   "image/png",
//   "image/webp",
//   "image/svg+xml",
//   "image/jpg",
//   "image/gif",
//   "image/jfif",
// ];

// export const uploadFileToS3Util = async (
//   file: Express.Multer.File,
//   bucket: string
// ) => {
//   const IMAGE_MIME_TYPES = [
//     "image/jpeg",
//     "image/png",
//     "image/svg+xml",
//     "image/jpg",
//     "image/gif",
//     "image/jfif",
//     "image/webp",
//   ];

//   if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
//     throw httpError(415, "الملف المرفوع ليس صورة مدعومة.");
//   }

//   try {
//     const { buffer: optimizedBuffer, format } = await optimizeImage(
//       file.buffer,
//       file.mimetype
//     );
//     const randomKey = (await generateRandomKey(32)) + ".webp";

//     const command = new PutObjectCommand({
//       Bucket: bucket,
//       Key: randomKey,
//       Body: optimizedBuffer,
//       ContentType: format,
//     });

//     await s3Client.send(command);

//     const fileUrl = `https://${bucket}.s3.${REGION}.amazonaws.com/${randomKey}`;
//     return fileUrl;
//   } catch (error: any) {
//     throw httpError(415, error.message);
//   }
// };

// export const deleteFileFromS3Util = async (
//   fileName: string,
//   bucketName: string
// ) => {
//   await s3Client.send(
//     new DeleteObjectCommand({
//       Bucket: bucketName,
//       Key: fileName,
//     })
//   );
// };
