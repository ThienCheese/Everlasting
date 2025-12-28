import { v2 as cloudinary } from 'cloudinary';
import CloudinaryStorageModule from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

const CloudinaryStorage = CloudinaryStorageModule.CloudinaryStorage || CloudinaryStorageModule;

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET || process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'app_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const uploadCloud = multer({ storage });

export default uploadCloud;