import db from '../../database/connection.js';

/**
 * Kiểm tra sự tồn tại của bản ghi trong bảng
 * @param {string} tableName - Tên bảng
 * @param {object} conditions - Điều kiện tìm kiếm
 * @returns {Promise<boolean>} - true nếu tồn tại, false nếu không
 */
export const recordExists = async (tableName, conditions) => {
  const result = await db(tableName).where(conditions).first();
  return !!result;
};

/**
 * Lấy bản ghi theo ID
 * @param {string} tableName - Tên bảng
 * @param {string} idColumn - Tên cột ID
 * @param {number} id - Giá trị ID
 * @returns {Promise<object|null>} - Bản ghi hoặc null
 */
export const findById = async (tableName, idColumn, id) => {
  return db(tableName).where({ [idColumn]: id }).first();
};

/**
 * Đếm số lượng bản ghi thỏa mãn điều kiện
 * @param {string} tableName - Tên bảng
 * @param {object} conditions - Điều kiện đếm
 * @returns {Promise<number>} - Số lượng bản ghi
 */
export const countRecords = async (tableName, conditions = {}) => {
  const result = await db(tableName).where(conditions).count('* as count').first();
  return parseInt(result.count);
};

/**
 * Soft delete - Đánh dấu bản ghi đã xóa
 * @param {string} tableName - Tên bảng
 * @param {string} idColumn - Tên cột ID
 * @param {number} id - Giá trị ID
 * @returns {Promise<number>} - Số bản ghi bị ảnh hưởng
 */
export const softDelete = async (tableName, idColumn, id) => {
  return db(tableName).where({ [idColumn]: id }).update({ DaXoa: true });
};

/**
 * Khôi phục bản ghi đã xóa mềm
 * @param {string} tableName - Tên bảng
 * @param {string} idColumn - Tên cột ID
 * @param {number} id - Giá trị ID
 * @returns {Promise<number>} - Số bản ghi bị ảnh hưởng
 */
export const restore = async (tableName, idColumn, id) => {
  return db(tableName).where({ [idColumn]: id }).update({ DaXoa: false });
};

/**
 * Lấy tất cả bản ghi chưa bị xóa
 * @param {string} tableName - Tên bảng
 * @param {string} orderBy - Cột sắp xếp
 * @returns {Promise<Array>} - Danh sách bản ghi
 */
export const getAllActive = async (tableName, orderBy = null) => {
  const query = db(tableName).where('DaXoa', false);
  
  if (orderBy) {
    query.orderBy(orderBy);
  }
  
  return query;
};

/**
 * Tạo bản ghi mới
 * @param {string} tableName - Tên bảng
 * @param {object} data - Dữ liệu cần tạo
 * @returns {Promise<object>} - Bản ghi vừa tạo
 */
export const createRecord = async (tableName, data) => {
  const [record] = await db(tableName).insert(data).returning('*');
  return record;
};

/**
 * Cập nhật bản ghi
 * @param {string} tableName - Tên bảng
 * @param {string} idColumn - Tên cột ID
 * @param {number} id - Giá trị ID
 * @param {object} data - Dữ liệu cần cập nhật
 * @returns {Promise<object>} - Bản ghi đã cập nhật
 */
export const updateRecord = async (tableName, idColumn, id, data) => {
  const [record] = await db(tableName)
    .where({ [idColumn]: id })
    .update(data)
    .returning('*');
  return record;
};

/**
 * Xóa cứng bản ghi
 * @param {string} tableName - Tên bảng
 * @param {string} idColumn - Tên cột ID
 * @param {number} id - Giá trị ID
 * @returns {Promise<number>} - Số bản ghi bị xóa
 */
export const hardDelete = async (tableName, idColumn, id) => {
  return db(tableName).where({ [idColumn]: id }).delete();
};

/**
 * Kiểm tra ràng buộc khóa ngoại
 * @param {string} tableName - Tên bảng chứa khóa ngoại
 * @param {string} foreignKey - Tên cột khóa ngoại
 * @param {number} value - Giá trị cần kiểm tra
 * @returns {Promise<boolean>} - true nếu có ràng buộc, false nếu không
 */
export const checkForeignKeyConstraint = async (tableName, foreignKey, value) => {
  const count = await countRecords(tableName, { [foreignKey]: value });
  return count > 0;
};

/**
 * Thực hiện transaction
 * @param {Function} callback - Hàm callback chứa các operations
 * @returns {Promise<any>} - Kết quả của transaction
 */
export const transaction = async (callback) => {
  return db.transaction(callback);
};

/**
 * Tìm kiếm bản ghi theo điều kiện
 * @param {string} tableName - Tên bảng
 * @param {object} conditions - Điều kiện tìm kiếm
 * @param {string} orderBy - Cột sắp xếp
 * @returns {Promise<Array>} - Danh sách bản ghi
 */
export const findWhere = async (tableName, conditions, orderBy = null) => {
  const query = db(tableName).where(conditions);
  
  if (orderBy) {
    query.orderBy(orderBy);
  }
  
  return query;
};

/**
 * Phân trang
 * @param {string} tableName - Tên bảng
 * @param {number} page - Trang hiện tại (bắt đầu từ 1)
 * @param {number} limit - Số bản ghi mỗi trang
 * @param {object} conditions - Điều kiện lọc
 * @param {string} orderBy - Cột sắp xếp
 * @returns {Promise<object>} - Kết quả phân trang
 */
export const paginate = async (tableName, page = 1, limit = 10, conditions = {}, orderBy = null) => {
  const offset = (page - 1) * limit;
  
  const query = db(tableName).where(conditions);
  
  if (orderBy) {
    query.orderBy(orderBy);
  }
  
  const data = await query.limit(limit).offset(offset);
  const total = await countRecords(tableName, conditions);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Tìm kiếm theo nhiều điều kiện với OR
 * @param {string} tableName - Tên bảng
 * @param {Array} orConditions - Mảng các điều kiện OR
 * @returns {Promise<Array>} - Danh sách bản ghi
 */
export const findWithOr = async (tableName, orConditions) => {
  return db(tableName).where(function() {
    orConditions.forEach((condition, index) => {
      if (index === 0) {
        this.where(condition);
      } else {
        this.orWhere(condition);
      }
    });
  });
};

/**
 * Batch insert - Thêm nhiều bản ghi cùng lúc
 * @param {string} tableName - Tên bảng
 * @param {Array} dataArray - Mảng dữ liệu cần thêm
 * @returns {Promise<Array>} - Danh sách bản ghi đã thêm
 */
export const batchInsert = async (tableName, dataArray) => {
  return db(tableName).insert(dataArray).returning('*');
};

/**
 * Tính tổng giá trị của cột
 * @param {string} tableName - Tên bảng
 * @param {string} column - Tên cột cần tính tổng
 * @param {object} conditions - Điều kiện lọc
 * @returns {Promise<number>} - Tổng giá trị
 */
export const sum = async (tableName, column, conditions = {}) => {
  const result = await db(tableName)
    .where(conditions)
    .sum(`${column} as total`)
    .first();
  
  return parseFloat(result.total) || 0;
};

/**
 * Tính trung bình giá trị của cột
 * @param {string} tableName - Tên bảng
 * @param {string} column - Tên cột cần tính trung bình
 * @param {object} conditions - Điều kiện lọc
 * @returns {Promise<number>} - Giá trị trung bình
 */
export const avg = async (tableName, column, conditions = {}) => {
  const result = await db(tableName)
    .where(conditions)
    .avg(`${column} as average`)
    .first();
  
  return parseFloat(result.average) || 0;
};

/**
 * Kiểm tra tên trùng lặp (ngoại trừ bản ghi hiện tại)
 * @param {string} tableName - Tên bảng
 * @param {string} nameColumn - Tên cột chứa tên
 * @param {string} name - Giá trị tên cần kiểm tra
 * @param {string} idColumn - Tên cột ID
 * @param {number} excludeId - ID cần loại trừ (cho trường hợp update)
 * @returns {Promise<boolean>} - true nếu trùng, false nếu không
 */
export const isDuplicateName = async (tableName, nameColumn, name, idColumn = null, excludeId = null) => {
  const query = db(tableName).where({ [nameColumn]: name });
  
  if (idColumn && excludeId) {
    query.whereNot({ [idColumn]: excludeId });
  }
  
  const result = await query.first();
  return !!result;
};

export default {
  recordExists,
  findById,
  countRecords,
  softDelete,
  restore,
  getAllActive,
  createRecord,
  updateRecord,
  hardDelete,
  checkForeignKeyConstraint,
  transaction,
  findWhere,
  paginate,
  findWithOr,
  batchInsert,
  sum,
  avg,
  isDuplicateName
};
