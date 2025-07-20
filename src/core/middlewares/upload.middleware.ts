import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { uploadPath } from "../../config/env.config";
import { optimizeImage } from "../../utils/file.utils";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // Use a valid relative path
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

export const upload = multer({ storage: multer.memoryStorage() });

export const handelMiddleware =
  (field: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        console.warn("No file uploaded");
      } else {
        const { buffer: optimizedBuffer } = await optimizeImage(
          req.file.buffer
        );

        const fileName = `avatar_${Date.now()}.webp`;
        const outputPath = path.join(uploadPath, fileName);

        fs.writeFileSync(outputPath, optimizedBuffer);
        req.body[field] = path.join("uploads", fileName);
      }
      next();
    } catch (e) {
      next(e);
    }
  };
