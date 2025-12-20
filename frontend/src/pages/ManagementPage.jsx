import React from 'react';
import './ManagementPage.css';

// 1. IMPORT ĐẦY ĐỦ ICON (Thêm FaEdit, FaTrash)

import { FaSearch, FaEdit, FaTrash, FaClock, FaCloudSun, FaSun, FaMoon, FaStar } from "react-icons/fa";

const ManagementPage = () => {
  
  const shifts = [
    { 
        id: 1, 
        name: "Sáng", 
        time: "08:00 - 12:00", 
        desc: "Tiệc cưới tiêu chuẩn",
        icon: <FaCloudSun style={{color: '#FDB813'}}/> 
    },
    { 
        id: 2, 
        name: "Trưa", 
        time: "12:30 - 16:30", 
        desc: "Phù hợp tiệc thân mật, chiêu đãi gia đình",
        icon: <FaSun style={{color: '#FF8C00'}}/> 
    },
    { 
        id: 3, 
        name: "Chiều", 
        time: "15:00 - 19:00", 
        desc: "Tiệc trà, sự kiện nhẹ nhàng",
        icon: <FaCloudSun style={{color: '#FFB74D'}}/> 
    },
    { 
        id: 4, 
        name: "Tối", 
        time: "17:30 - 21:30", 
        desc: "Giờ vàng, phụ thu thêm phí dịch vụ",
        icon: <FaMoon style={{color: '#5E35B1'}}/> 
    },
    { 
        id: 5, 
        name: "Ban đêm", 
        time: "22:00 - 02:00", 
        desc: "After party, tiệc riêng tư",
        icon: <FaStar style={{color: '#3949AB'}}/> 
    },
  ];

  const halls = [
    { 
      id: 1, 
      name: "Ngọc Uyên Ương Hall", 
      type: "VIP", 
      capacity: 60, 
      note: "Sảnh lớn, tone vàng ngọc trai, phù hợp tiệc truyền thống.", 
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
    },
    { 
      id: 2, 
      name: "Thiên Duyên Garden", 
      type: "Ngoài trời", 
      capacity: 40, 
      note: "Phong cách sân vườn châu Âu, nhiều ánh đèn và hoa tươi.", 
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
    },
    { 
      id: 3, 
      name: "Ánh Trăng Vàng Hall", 
      type: "Trung", 
      capacity: 55, 
      note: "Trang trí tone vàng kem, ánh sáng dịu, không gian cổ tích.", 
      image: "https://images.unsplash.com/photo-1522673607200-1645062cd958?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
    },
  ];

  const hallTypes = [
    {
      id: 1,
      name: "Thường",
      desc: "Phù hợp tiệc nhỏ, chi phí tiết kiệm, decor cơ bản.",
      price: "8.000.000",
      note: "Có thể trang trí thêm tùy chọn."
    },
    {
      id: 2,
      name: "Trung",
      desc: "Sảnh tiêu chuẩn, không gian đẹp, phục vụ ổn định.",
      price: "15.000.000",
      note: "Thường được chọn cho tiệc 150-250 khách."
    },
    {
      id: 3,
      name: "Cao cấp",
      desc: "Thiết kế hiện đại, hệ thống âm thanh ánh sáng cao cấp.",
      price: "28.000.000",
      note: "Tặng kèm MC hoặc ban nhạc mini."
    },
    {
      id: 4,
      name: "VIP",
      desc: "Sảnh sang trọng nhất, tone hoàng gia, phục vụ riêng.",
      price: "55.000.000",
      note: "Có phòng chờ cô dâu - chú rể riêng."
    },
    {
      id: 5,
      name: "Ngoài trời",
      desc: "Sảnh sân vườn, decor tự nhiên, nhiều ánh đèn và cây xanh.",
      price: "25.000.000",
      note: "Phù hợp tiệc tối và chụp ảnh ngoại cảnh."
    },
  ];

  return (
    <div className="management-container">
      <div className="content-body">
        
        {/* --- PHẦN 1: QUẢN LÝ CA (Đã cập nhật dùng Icon) --- */}
        <section className="section-block">
          <div className="section-header-row">
            <h2 className="section-title">Quản lý ca</h2>
            <div className="controls-group">
                <div className="search-box">
                    <input type="text" placeholder="Tìm ca..." />
                    <FaSearch className="search-icon" />
                </div>
                <button className="add-btn">Thêm ca</button>
            </div>
          </div>

          <table className="custom-table shift-table">
            <thead>
              <tr>
                <th style={{width: '20%'}}>Tên ca</th>
                <th style={{width: '20%'}}>Khung giờ</th>
                <th style={{width: '30%'}}>Mô tả</th>
                <th style={{width: '15%'}} className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr key={shift.id}>
                  {/* Cột Tên Ca + Icon */}
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <div className="shift-icon-box">
                            {shift.icon}
                        </div>
                        <span style={{fontWeight: 'bold', fontSize: '15px'}}>{shift.name}</span>
                    </div>
                  </td>

                  {/* Cột Giờ */}
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontWeight: '500'}}>
                        <FaClock style={{color: '#8A7CDF'}}/>
                        {shift.time}
                    </div>
                  </td>

                  {/* Cột Mô tả */}
                  <td style={{fontSize: '14px', color: '#666'}}>{shift.desc}</td>

                 

                  {/* Cột Hành động */}
                  <td className="text-right">
                    <div className="action-cells" style={{justifyContent: 'flex-end'}}>
                        <button className="icon-btn edit-btn" title="Sửa"><FaEdit /></button>
                        <button className="icon-btn delete-btn" title="Xóa"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* --- PHẦN 2: QUẢN LÝ SẢNH (Đã cập nhật dùng Icon) --- */}
        <section className="section-block mt-large">
          <div className="section-header-row">
            <h2 className="section-title">Quản lý sảnh</h2>
            <div className="controls-group">
                <div className="search-box">
                  <input type="text" placeholder="Tìm sảnh..." />
                  <FaSearch className="search-icon" />
                </div>
                <button className="add-btn">Thêm sảnh</button>
            </div>
          </div>

          <table className="custom-table hall-table">
            <thead>
              <tr>
                <th style={{width: '20%'}}>Tên sảnh</th>
                <th style={{width: '10%'}}>Loại</th>
                <th style={{width: '10%', textAlign: 'center'}}>Bàn tối đa</th>
                <th style={{width: '35%'}}>Ghi chú</th>
                <th style={{width: '15%'}}>Hình</th>
                <th style={{width: '10%'}} className="text-right">Chỉnh sửa</th>
              </tr>
            </thead>
            <tbody>
              {halls.map((hall) => (
                <tr key={hall.id}>
                  <td style={{fontWeight: 'bold'}}>{hall.name}</td>
                  <td><span style={{padding: '4px 8px', background: '#f0f0f0', borderRadius: '4px', fontSize: '12px'}}>{hall.type}</span></td>
                  <td className="text-center">{hall.capacity}</td>
                  <td className="note-text">{hall.note}</td>
                  <td>
                    <img src={hall.image} alt={hall.name} className="hall-thumbnail" />
                  </td>
                  <td className="text-right">
                    <div className="action-cells" style={{justifyContent: 'flex-end'}}>
                        <button className="icon-btn edit-btn" title="Sửa"><FaEdit /></button>
                        <button className="icon-btn delete-btn" title="Xóa"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* --- PHẦN 3: QUẢN LÝ LOẠI SẢNH (Đã sửa căn lề giống bảng trên) --- */}
        <section className="section-block">
            <div className="section-header-row">
                <h2 className="section-title">Quản lý loại sảnh</h2>
                
                <div className="controls-group">
                    <div className="search-box">
                        <input type="text" placeholder="Tìm loại sảnh..." />
                        <FaSearch className="search-icon" />
                    </div>
                    <button className="add-btn">Thêm loại sảnh</button>
                </div>
            </div>

            <table className="custom-table">
                <thead>
                    <tr>
                        <th style={{width: '15%'}}>Loại</th>
                        <th style={{width: '25%'}}>Mô tả</th>
                        <th style={{width: '15%'}}>Giá</th>
                        <th style={{width: '30%'}}>Ghi chú</th>
                        {/* Căn phải tiêu đề cột Chỉnh sửa */}
                        <th style={{width: '15%'}} className="text-right">Chỉnh sửa</th>
                    </tr>
                </thead>
                <tbody>
                    {hallTypes.map((type) => (
                    <tr key={type.id}>
                        <td style={{fontWeight: 'bold', color: '#333'}}>{type.name}</td>
                        <td style={{fontSize: '14px', color: '#555'}}>{type.desc}</td>
                        <td style={{fontWeight: 'bold', color: '#8A7CDF'}}>{type.price} VND</td>
                        <td style={{fontSize: '13px', color: '#777', fontStyle: 'italic'}}>{type.note}</td>
                        
                        {/* SỬA LỖI Ở ĐÂY: Thêm text-right và justify-content: flex-end */}
                        <td className="text-right">
                            <div className="action-cells" style={{justifyContent: 'flex-end'}}>
                                <button className="icon-btn edit-btn" title="Sửa"><FaEdit /></button>
                                <button className="icon-btn delete-btn" title="Xóa"><FaTrash /></button>
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

export default ManagementPage;