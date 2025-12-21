import db from '../../database/connection.js';

const PhanQuyen = {
  // Lấy tất cả phân quyền
  async getAll() {
    return db('PHANQUYEN')
      .select(
        'PHANQUYEN.*',
        'NHOMNGUOIDUNG.TenNhom',
        'CHUCNANG.TenChucNang',
        'CHUCNANG.TenManHinh'
      )
      .leftJoin('NHOMNGUOIDUNG', 'PHANQUYEN.MaNhom', 'NHOMNGUOIDUNG.MaNhom')
      .leftJoin('CHUCNANG', 'PHANQUYEN.MaChucNang', 'CHUCNANG.MaChucNang')
      .orderBy(['NHOMNGUOIDUNG.TenNhom', 'CHUCNANG.TenChucNang']);
  },

  // Lấy phân quyền theo nhóm
  async getByNhom(maNhom) {
    return db('PHANQUYEN')
      .select(
        'PHANQUYEN.*',
        'CHUCNANG.TenChucNang',
        'CHUCNANG.TenManHinh'
      )
      .leftJoin('CHUCNANG', 'PHANQUYEN.MaChucNang', 'CHUCNANG.MaChucNang')
      .where('PHANQUYEN.MaNhom', maNhom)
      .orderBy('CHUCNANG.TenChucNang');
  },

  // Lấy phân quyền theo chức năng
  async getByChucNang(maChucNang) {
    return db('PHANQUYEN')
      .select(
        'PHANQUYEN.*',
        'NHOMNGUOIDUNG.TenNhom'
      )
      .leftJoin('NHOMNGUOIDUNG', 'PHANQUYEN.MaNhom', 'NHOMNGUOIDUNG.MaNhom')
      .where('PHANQUYEN.MaChucNang', maChucNang)
      .orderBy('NHOMNGUOIDUNG.TenNhom');
  },

  // Kiểm tra quyền
  async checkPermission(maNhom, maChucNang) {
    const result = await db('PHANQUYEN')
      .where({ MaNhom: maNhom, MaChucNang: maChucNang })
      .first();
    return !!result;
  },

  // Thêm phân quyền
  async create(data) {
    const [phanQuyen] = await db('PHANQUYEN')
      .insert(data)
      .returning('*');
    return phanQuyen;
  },

  // Xóa phân quyền
  async remove(maNhom, maChucNang) {
    return db('PHANQUYEN')
      .where({ MaNhom: maNhom, MaChucNang: maChucNang })
      .delete();
  },

  // Xóa tất cả phân quyền của nhóm
  async removeByNhom(maNhom) {
    return db('PHANQUYEN')
      .where({ MaNhom: maNhom })
      .delete();
  },

  // Cập nhật phân quyền cho nhóm (xóa hết và thêm mới)
  async updateByNhom(maNhom, danhSachChucNang) {
    // Xóa hết phân quyền cũ
    await this.removeByNhom(maNhom);
    
    // Thêm phân quyền mới
    if (danhSachChucNang && danhSachChucNang.length > 0) {
      const data = danhSachChucNang.map(maChucNang => ({
        MaNhom: maNhom,
        MaChucNang: maChucNang
      }));
      
      return db('PHANQUYEN').insert(data).returning('*');
    }
    
    return [];
  }
};

export default PhanQuyen;
