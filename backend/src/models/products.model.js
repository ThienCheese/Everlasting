import db from '../../database/connection.js';

const products = {
  // Lấy tất cả sản phẩm
  async getAll() {
    return db('dishes').select('*');
  },

  // Tạo mới một sản phẩm
  async create(productData) {
    const [product] = await db('products')
      .insert(productData)
      .returning('*'); // PostgreSQL hỗ trợ returning
    return product;
  },

  // Tìm sản phẩm theo ID
  async findById(id) {
    return db('products').where({ id }).first();
  },

  // Cập nhật sản phẩm
  async update(id, updatedData) {
    const [product] = await db('products')
      .where({ id })
      .update(updatedData)
      .returning('*');
    return product;
  },

  // Xoá sản phẩm
  async remove(id) {
    return db('products').where({ id }).del();
  },
};

export default products;
