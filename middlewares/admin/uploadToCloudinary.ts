import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

// Config Cloudinary từ biến môi trường
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Hàm upload stream
const streamUpload = (buffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Hàm upload chính
export const uploadToCloudinary = async (buffer: Buffer): Promise<string> => {
  const result = await streamUpload(buffer);
  return result["url"];
};

// Middleware upload 1 file
export const uploadSingle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await uploadToCloudinary(req["file"].buffer);
    req.body[req["file"].fieldname] = result;
  } catch (error) {
    console.log(error);
  }
  next();
};
