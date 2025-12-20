import React, { useState } from 'react';
import './MenuManagement.css';
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const MenuManagement = () => {
  // 1. Đổi tên state: Quản lý danh mục đang được chọn
  const [danhMucHienTai, setDanhMucHienTai] = useState('all');

  // 2. Đổi tên biến dữ liệu: Danh sách tất cả món ăn
  const danhSachMonAn = [
    { 
      id: 1, 
      name: "Gỏi Ngó Sen Tôm Thịt", 
      category: "Khai vị", 
      price: "350.000", 
      status: "available", 
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
    },
    { 
      id: 2, 
      name: "Súp Cua Bách Hoa", 
      category: "Khai vị", 
      price: "400.000", 
      status: "available",
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
    },
    { 
      id: 3, 
      name: "Bò Sốt Tiêu Đen + Bánh Bao", 
      category: "Món chính", 
      price: "550.000", 
      status: "available",
      image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
    },
    { 
      id: 4, 
      name: "Lẩu Thái Hải Sản", 
      category: "Món chính", 
      price: "650.000", 
      status: "soldout",
      image: "https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
    },
    { 
      id: 5, 
      name: "Trái Cây Thập Cẩm", 
      category: "Tráng miệng", 
      price: "200.000", 
      status: "available",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
    },
  ];

  // 3. Đổi tên biến: Logic lọc món ăn để hiển thị ra bảng
  const monAnHienThi = danhMucHienTai === 'all' 
    ? danhSachMonAn 
    : danhSachMonAn.filter(mon => mon.category === danhMucHienTai);

  // 4. Đổi tên biến: Danh sách các nút Tab
  const danhSachTab = [
    { id: 'all', label: 'Tất cả' },
    { id: 'Khai vị', label: 'Khai vị' },
    { id: 'Món chính', label: 'Món chính' },
    { id: 'Tráng miệng', label: 'Tráng miệng' },
    { id: 'Nước uống', label: 'Nước uống' },
  ];
  const danhSachSetMenu = [
    {
        id: 'A', name: 'Set Menu A', price: '2.900.000', priceBooked: '2.900.000',
        items: 'Gỏi ngó sen tôm thịt, Súp cua gà xé, Gà hấp hành gừng, Cá điêu hồng chiên xù, Lẩu Thái hải sản, Chè hạt sen.',
        note: 'Set menu chọn lọc theo phong cách truyền thống Việt Nam, phù hợp 10 người/bàn'
    },
    {
        id: 'B', name: 'Set Menu B', price: '3.200.000', priceBooked: '3.200.000',
        items: 'Gỏi bưởi tôm sú, Súp hải sản trứng cút, Tôm càng rang muối, Cá chẽm hấp Hong Kong, Lẩu nấm hải sản, Trái cây.',
        note: 'Món hải sản tươi ngon, phong cách thanh vị, phù hợp tiệc nhẹ nhàng'
    },
    {
        id: 'C', name: 'Set Menu C', price: '3.500.000', priceBooked: '3.500.000',
        items: 'Salad rau củ trộn trứng, Súp kem bí đỏ, Bò áp chảo sốt vang đỏ, Cá hồi nướng sốt cam, Lẩu nấm chay, Bánh flan.',
        note: 'Thực đơn phong cách Âu - Á kết hợp, sang trọng và tinh tế'
    }
  ];

  // --- 3. CODE MỚI: DỮ LIỆU LOẠI MÓN ĂN ---
  const danhSachLoaiMon = [
    { id: 1, name: 'Khai vị' },
    { id: 2, name: 'Món chính' },
    { id: 3, name: 'Tráng miệng' },
    { id: 4, name: 'Nước uống' },
    { id: 5, name: 'Món chay' },
  ];

  return (
    <div className="menu-page-wrapper">
      <div className="content-body">
        <section className="section-block">
          
          {/* Header Section */}
          <div className="section-header-row">
            <h2 className="section-title">Quản lý thực đơn</h2>
            
            <div className="controls-group">
              <div className="search-box">
                <input type="text" placeholder="Tìm tên món..." />
                <FaSearch className="search-icon" />
              </div>
              <button className="add-btn"><FaPlus /> Thêm món mới</button>
            </div>
          </div>

          {/* Tabs lọc món ăn */}
          <div className="menu-tabs">
             {danhSachTab.map(tab => (
                <button 
                    key={tab.id}
                    className={`tab-btn ${danhMucHienTai === tab.id ? 'active' : ''}`}
                    onClick={() => setDanhMucHienTai(tab.id)}
                >
                    {tab.label}
                </button>
             ))}
          </div>

          {/* Bảng danh sách món */}
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{width: '10%'}}>Hình</th>
                <th style={{width: '25%'}}>Tên món ăn</th>
                <th style={{width: '15%'}}>Danh mục</th>
                <th style={{width: '15%'}}>Đơn giá</th>
                <th style={{width: '15%'}} className="text-center">Trạng thái</th>
                <th style={{width: '20%'}} className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {monAnHienThi.map((mon) => (
                <tr key={mon.id}>
                  {/* Cột Hình ảnh */}
                  <td>
                    <img src={mon.image} alt={mon.name} className="menu-thumbnail" />
                  </td>

                  {/* Cột Tên món */}
                  <td style={{fontWeight: '600', color: '#333'}}>{mon.name}</td>

                  {/* Cột Danh mục */}
                  <td>
                      <span className="category-badge">{mon.category}</span>
                  </td>

                  {/* Cột Giá */}
                  <td style={{fontWeight: 'bold', color: '#8A7CDF'}}>{mon.price} đ</td>

                  {/* Cột Trạng thái */}
                  <td className="text-center">
                    <span className={`status-badge ${mon.status}`}>
                        {mon.status === 'available' ? 'Available' : 'Unavailable'}
                    </span>
                  </td>

                  {/* Cột Thao tác */}
                  <td className="text-center">
                    <div className="action-cells">
                      <button className="icon-btn edit-btn" title="Sửa"><FaEdit /></button>
                      <button className="icon-btn delete-btn" title="Xóa"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </section>
        <section className="section-block">
            <div className="section-header-row">
                <h2 className="section-title">Gợi ý thực đơn (Set Menu)</h2>
                
                {/* Thêm controls-group để gom nhóm ô tìm kiếm và nút bấm */}
                <div className="controls-group">
                    <div className="search-box">
                        <input type="text" placeholder="Tìm set menu..." />
                        <FaSearch className="search-icon" />
                    </div>
                    {/* Nút thêm mới */}
                    <button className="add-btn"><FaPlus /> Thêm Set Menu</button>
                </div>
            </div>

            <table className="custom-table">
                <thead>
                    <tr>
                        <th style={{width: '15%'}}>Tên thực đơn</th>
                        <th style={{width: '12%'}}>Giá hiện tại</th>
                        <th style={{width: '12%'}}>Giá đặt cọc</th>
                        <th style={{width: '30%'}}>Danh sách món ăn</th>
                        <th style={{width: '20%'}}>Ghi chú</th>
                        <th style={{width: '11%'}} className="text-center">Chỉnh sửa</th>
                    </tr>
                </thead>
                <tbody>
                    {danhSachSetMenu.map((set) => (
                        <tr key={set.id}>
                            <td style={{fontWeight: '800', color: '#333'}}>{set.name}</td>
                            <td style={{fontWeight: '600'}}>{set.price}</td>
                            <td style={{fontWeight: '600'}}>{set.priceBooked}</td>
                            
                            {/* Danh sách món ăn dài, cho chữ nhỏ lại xíu và xám đi */}
                            <td style={{fontSize: '13px', lineHeight: '1.5', color: '#555'}}>
                                {set.items}
                            </td>
                            
                            <td style={{fontSize: '13px', fontStyle: 'italic', color: '#777'}}>
                                {set.note}
                            </td>

                            <td className="text-center">
                                <div className="action-cells">
                                    <button className="icon-btn edit-btn"><FaEdit /></button>
                                    <button className="icon-btn delete-btn"><FaTrash /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>

        {/* =========================================================
            PHẦN 3: DANH SÁCH LOẠI MÓN - MỚI THÊM
           ========================================================= */}
        <section className="section-block">
            <div className="section-header-row">
                <h2 className="section-title">Danh sách loại món</h2>
                
                {/* Thêm controls-group để gom nhóm */}
                <div className="controls-group">
                    <div className="search-box">
                        <input type="text" placeholder="Tìm loại món..." />
                        <FaSearch className="search-icon" />
                    </div>
                    {/* Nút thêm mới */}
                    <button className="add-btn"><FaPlus /> Thêm loại món</button>
                </div>
            </div>

            <table className="custom-table">
                <thead>
                    <tr>
                        <th style={{width: '80%'}}>Loại món ăn</th>
                        <th style={{width: '20%'}} className="text-center">Chỉnh sửa</th>
                    </tr>
                </thead>
                <tbody>
                    {danhSachLoaiMon.map((loai) => (
                        <tr key={loai.id}>
                            <td style={{fontWeight: 'bold', fontSize: '15px'}}>{loai.name}</td>
                            <td className="text-center">
                                <div className="action-cells">
                                    <button className="icon-btn edit-btn"><FaEdit /></button>
                                    <button className="icon-btn delete-btn"><FaTrash /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
      </div>
    </div>
  );
};

export default MenuManagement;