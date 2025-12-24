export const uploadImage = (req, res, next) => {
  try {
    // Kiểm tra nếu không có file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn ảnh để tải lên'
      });
    }

    // Trả về kết quả thành công
    return res.status(200).json({
      success: true,
      message: 'Upload thành công',
      data: {
        url: req.file.path,      // Link ảnh dùng để hiển thị
        publicId: req.file.filename // ID dùng để xóa ảnh sau này
      }
    });
  } catch (error) {
    next(error); // Chuyển lỗi sang errorHandler của bạn
  }
};