import { Router } from 'express';
import ThucDonMau from '../models/thucdonmau.model.js';
import ThucDon from '../models/thucdon.model.js';
import { successResponse, errorResponse } from '../helpers/response.helper.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { validateCreateThucDonMau, validateUpdateThucDonMau, validateAddMonAnToTemplate, validateCreateFromTemplate } from '../middleware/validations/validateThucDonMau.js';
import { createLimiter, deleteLimiter } from '../middleware/ratelimit.middleware.js';
import { requirePermission } from '../middleware/authorization.middleware.js';
import { validateIdParam, validatePagination } from '../middleware/sanitize.middleware.js';
import { auditLogger } from '../middleware/logging.middleware.js';

const router = Router();

// Lấy tất cả thực đơn mẫu
router.get('/lists', validatePagination, async (req, res) => {
  try {
    const thucDonMauList = await ThucDonMau.getAll();
    return successResponse(res, thucDonMauList, 'Lay danh sach thuc don mau thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// Lấy chi tiết thực đơn mẫu
router.get('/details/:id', validateIdParam('id'), async (req, res) => {
  try {
    const thucDonMau = await ThucDonMau.findById(req.params.id);
    if (!thucDonMau) {
      return errorResponse(res, 'Thuc don mau khong ton tai', 404);
    }

    const monAn = await ThucDonMau.getMonAn(req.params.id);
    thucDonMau.monAn = monAn;

    return successResponse(res, thucDonMau, 'Lay thong tin thuc don mau thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// Tạo thực đơn mẫu
router.post('/create', authMiddleware, requirePermission('QUAN_LY_MON_AN'), createLimiter, validateCreateThucDonMau, auditLogger('THUCDONMAU_CREATE'), async (req, res) => {
  try {
    const { tenThucDon, donGiaHienTai, ghiChu } = req.body;

    const thucDonMau = await ThucDonMau.create({
      TenThucDon: tenThucDon,
      DonGiaHienTai: donGiaHienTai,
      GhiChu: ghiChu
    });

    return successResponse(res, thucDonMau, 'Tao thuc don mau thanh cong', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// Cập nhật thực đơn mẫu
router.put('/update/:id', authMiddleware, requirePermission('QUAN_LY_MON_AN'), validateIdParam('id'), validateUpdateThucDonMau, auditLogger('THUCDONMAU_UPDATE'), async (req, res) => {
  try {
    const thucDonMau = await ThucDonMau.findById(req.params.id);
    if (!thucDonMau) {
      return errorResponse(res, 'Thuc don mau khong ton tai', 404);
    }

    const { tenThucDon, donGiaHienTai, ghiChu } = req.body;

    const updated = await ThucDonMau.update(req.params.id, {
      TenThucDon: tenThucDon || thucDonMau.TenThucDon,
      DonGiaHienTai: donGiaHienTai !== undefined ? donGiaHienTai : thucDonMau.DonGiaHienTai,
      GhiChu: ghiChu !== undefined ? ghiChu : thucDonMau.GhiChu
    });

    return successResponse(res, updated, 'Cap nhat thuc don mau thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// Xóa thực đơn mẫu
router.delete('/delete/:id', authMiddleware, requirePermission('QUAN_LY_MON_AN'), validateIdParam('id'), deleteLimiter, auditLogger('THUCDONMAU_DELETE'), async (req, res) => {
  try {
    const thucDonMau = await ThucDonMau.findById(req.params.id);
    if (!thucDonMau) {
      return errorResponse(res, 'Thuc don mau khong ton tai', 404);
    }

    await ThucDonMau.remove(req.params.id);

    return successResponse(res, { id: req.params.id }, 'Xoa thuc don mau thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// Quản lý món ăn trong thực đơn mẫu
router.get('/:id/monan', validateIdParam('id'), async (req, res) => {
  try {
    const monAn = await ThucDonMau.getMonAn(req.params.id);
    return successResponse(res, monAn, 'Lay danh sach mon an thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

router.post('/:id/monan', authMiddleware, requirePermission('QUAN_LY_MON_AN'), validateIdParam('id'), validateAddMonAnToTemplate, auditLogger('THUCDONMAU_ADD_MONAN'), async (req, res) => {
  try {
    const { maMonAn } = req.body;
    const result = await ThucDonMau.addMonAn(req.params.id, maMonAn);
    return successResponse(res, result, 'Them mon an vao thuc don mau thanh cong', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

router.delete('/:id/monan/:maMonAn', authMiddleware, requirePermission('QUAN_LY_MON_AN'), validateIdParam('id'), validateIdParam('maMonAn'), deleteLimiter, auditLogger('THUCDONMAU_REMOVE_MONAN'), async (req, res) => {
  try {
    await ThucDonMau.removeMonAn(req.params.id, req.params.maMonAn);
    return successResponse(res, { maMonAn: req.params.maMonAn }, 'Xoa mon an khoi thuc don mau thanh cong', 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// Sao chép thực đơn mẫu sang thực đơn thật
router.post('/:id/copy', authMiddleware, requirePermission('QUAN_LY_MON_AN'), validateIdParam('id'), validateCreateFromTemplate, auditLogger('THUCDONMAU_COPY'), async (req, res) => {
  try {
    const { tenThucDon, ghiChu } = req.body;
    const thucDon = await ThucDon.createFromTemplate(req.params.id, tenThucDon, ghiChu);
    return successResponse(res, thucDon, 'Sao chep thuc don mau thanh cong', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

export default router;
