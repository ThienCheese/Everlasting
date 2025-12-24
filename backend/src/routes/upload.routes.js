// src/routes/upload.routes.js
import express from 'express';
// Import file cấu hình Cloudinary bạn đã tạo
import uploadCloud from '../../config/cloudinary.js'; 
// Import controller vừa tạo ở bước 1
import { uploadImage } from '../controller/upload.controller.js';

const router = express.Router();

// --- ĐỊNH NGHĨA API ---
// Method: POST
// Đường dẫn: / (vì ta sẽ gắn prefix /upload ở bên ngoài)
// Middleware: uploadCloud.single('image') -> Xử lý upload trước
// Controller: uploadImage -> Trả kết quả sau
router.post('/', uploadCloud.single('image'), uploadImage);

export default router;