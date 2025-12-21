/**
 * Danh sách các chức năng và mã chức năng trong hệ thống
 * Mapping với bảng CHUCNANG trong database
 */

export const PERMISSIONS = {
  // Quản lý người dùng (MaChucNang = 1)
  MANAGE_USERS: {
    id: 1,
    name: 'Quản lý người dùng',
    screen: 'UserScreen',
  },
  
  // Quản lý sảnh (MaChucNang = 2)
  MANAGE_HALLS: {
    id: 2,
    name: 'Quản lý sảnh',
    screen: 'HallsScreen',
  },
  
  // Quản lý món ăn (MaChucNang = 3)
  MANAGE_FOOD: {
    id: 3,
    name: 'Quản lý món ăn',
    screen: 'FoodScreen',
  },
  
  // Quản lý dịch vụ (MaChucNang = 4)
  MANAGE_SERVICE: {
    id: 4,
    name: 'Quản lý dịch vụ',
    screen: 'ServiceScreen',
  },
  
  // Quản lý đặt tiệc (MaChucNang = 5)
  MANAGE_BOOKING: {
    id: 5,
    name: 'Quản lý đặt tiệc',
    screen: 'BookingScreen',
  },
};

/**
 * Danh sách các nhóm người dùng
 * Mapping với bảng NHOMNGUOIDUNG trong database
 */
export const ROLES = {
  ADMIN: 1,
  RECEPTIONIST: 2, // Lễ tân
  MANAGER: 3, // Quản lý
  CHEF: 4, // Bếp trưởng
  ACCOUNTANT: 5, // Kế toán
  GUEST: 6, // Guest - User mới đăng ký, chỉ có quyền truy cập public endpoints
};

/**
 * Ma trận phân quyền (để tham khảo)
 * Thực tế sẽ query từ bảng PHANQUYEN
 */
export const PERMISSION_MATRIX = {
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_USERS.id,
    PERMISSIONS.MANAGE_HALLS.id,
    PERMISSIONS.MANAGE_FOOD.id,
    PERMISSIONS.MANAGE_SERVICE.id,
    PERMISSIONS.MANAGE_BOOKING.id,
  ],
  [ROLES.RECEPTIONIST]: [
    PERMISSIONS.MANAGE_HALLS.id,
    PERMISSIONS.MANAGE_BOOKING.id,
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.MANAGE_HALLS.id,
    PERMISSIONS.MANAGE_FOOD.id,
    PERMISSIONS.MANAGE_SERVICE.id,
  ],
  [ROLES.CHEF]: [
    PERMISSIONS.MANAGE_FOOD.id,
    PERMISSIONS.MANAGE_BOOKING.id,
  ],
  [ROLES.ACCOUNTANT]: [
    PERMISSIONS.MANAGE_BOOKING.id,
  ],
  [ROLES.GUEST]: [
    // Guest không có quyền nào - chỉ truy cập public endpoints
  ],
};
