import db from '../../database/connection.js';

const Dish = {
  // Lấy tất cả món ăn
  async getAll() {
    return db("dishes").select("*").orderBy("id");
  },

  // Tìm món ăn theo ID
  async findById(id) {
    return db("dishes").where({ id }).first();
  },

  // Tạo mới món ăn
  async create(dishData) {
    const [dish] = await db("dishes").insert(dishData).returning("*");
    return dish;
  },

  // Cập nhật món ăn
  async update(id, updatedData) {
    const [dish] = await db("dishes")
      .where({ id })
      .update(updatedData)
      .returning("*");
    return dish;
  },

  // Xoá món ăn
  async remove(id) {
    const [deleted] = await db("dishes")
      .where({ id })
      .del()
      .returning("id");
    return deleted;
  },
};

export default Dish;
