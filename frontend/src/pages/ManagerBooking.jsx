import React, { useState, useEffect } from 'react';
import './ManagerBooking.css';
import { 
    FaUser, FaCalendarAlt, FaUsers, FaCheckCircle, 
    FaUtensils, FaMusic, FaLayerGroup, FaMoneyBillWave, 
    FaPlusCircle, FaMinusCircle, FaInfoCircle 
} from "react-icons/fa";

const ManagerBooking = () => {
  // --- 1. DỮ LIỆU MẪU (MOCK DATA) ---
  
  // A. SẢNH & LOẠI SẢNH
  const hallTypes = ["Tất cả", "Trong nhà", "Ngoài trời", "Sảnh VIP"];
  
  const halls = [
    { id: 1, name: "Sảnh Ngọc Uyên Ương", type: "Trong nhà", capacity: 400, price: 15000000, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", desc: "Không gian sang trọng, ấm cúng với hệ thống đèn chùm pha lê." },
    { id: 2, name: "Thiên Duyên Garden", type: "Ngoài trời", capacity: 250, price: 12000000, image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", desc: "Không gian xanh mát, thoáng đãng, phù hợp tiệc tối lãng mạn." },
    { id: 3, name: "Sảnh Đại Yến VIP", type: "Sảnh VIP", capacity: 800, price: 25000000, image: "https://images.unsplash.com/photo-1519225421980-715cb0202128?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", desc: "Sảnh lớn nhất, trang bị màn hình LED 500 inch và âm thanh vòm." },
    { id: 4, name: "Sảnh Ruby (Lầu 1)", type: "Trong nhà", capacity: 300, price: 10000000, image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", desc: "Thiết kế hiện đại, phù hợp cho các buổi tiệc quy mô vừa và nhỏ." },
  ];

  // B. THỰC ĐƠN (SET MENU & MÓN LẺ)
  // Bổ sung hình ảnh cho Set Menu
  const setMenus = [
    { 
        id: "SET01", name: "Set Truyền Thống", price: 3500000, 
        image: "https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        desc: "Thực đơn 6 món đậm đà hương vị Việt, phù hợp khẩu vị đa số khách mời.",
        items: ["Súp Cua Bể", "Gỏi Ngó Sen", "Gà Hấp Lá Chanh", "Lẩu Thái Hải Sản", "Trái Cây"] 
    },
    { 
        id: "SET02", name: "Set Hải Sản Cao Cấp", price: 5200000, 
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        desc: "Đẳng cấp với Tôm hùm và Bào ngư, nguyên liệu tươi sống trong ngày.",
        items: ["Súp Bào Ngư", "Salad Tôm Thái", "Tôm Hùm Phô Mai", "Cá Mú Hấp Xì Dầu", "Lẩu Cua Đồng", "Chè Hạt Sen"] 
    },
    { 
        id: "SET03", name: "Set Âu Á (Fusion)", price: 4800000, 
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        desc: "Sự kết hợp tinh tế, trình bày theo phong cách Fine Dining.",
        items: ["Salad Cá Hồi", "Súp Bí Đỏ Kem Tươi", "Bò Beefsteak Sốt Tiêu", "Mì Ý Carbonara", "Sườn Cừu Nướng", "Bánh Tiramisu"] 
    },
  ];

  const singleItems = [
    { id: 101, name: "Súp Bào Ngư Vi Cá", type: "Khai vị", price: 500000 },
    { id: 102, name: "Gỏi Ngó Sen Tôm Thịt", type: "Khai vị", price: 350000 },
    { id: 201, name: "Bò Sốt Tiêu Đen", type: "Món chính", price: 650000 },
    { id: 202, name: "Lẩu Thái Hải Sản", type: "Món chính", price: 800000 },
    { id: 301, name: "Chè Hạt Sen", type: "Tráng miệng", price: 200000 },
    { id: 302, name: "Bánh Plan", type: "Tráng miệng", price: 150000 },
  ];

  // Bổ sung hình ảnh và mô tả cho Dịch vụ
  const services = [
    { 
        id: 901, name: "Ban nhạc Acoustic", price: 5000000, 
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        desc: "Gồm 1 Guitar, 1 Cajon, 2 Ca sĩ. Biểu diễn xuyên suốt 2 tiếng đón khách và làm lễ." 
    },
    { 
        id: 902, name: "MC Chuyên nghiệp", price: 3000000, 
        image: "https://images.unsplash.com/photo-1475721027767-f4242310f17e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        desc: "MC nam/nữ kinh nghiệm trên 5 năm, dẫn dắt chương trình và hoạt náo gameshow." 
    },
    { 
        id: 903, name: "Trang trí hoa tươi", price: 8000000, 
        image: "https://images.unsplash.com/photo-1519225421980-715cb0202128?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        desc: "Trang trí lối đi, bàn gallery và backdrop chụp hình bằng 100% hoa tươi Đà Lạt." 
    },
    { 
        id: 904, name: "Vũ đoàn khai mạc", price: 4000000, 
        image: "https://images.unsplash.com/photo-1496024840928-4c417adf211d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        desc: "Nhóm múa 6 người, biểu diễn tiết mục mở màn 'Love Story' hoặc nhảy hiện đại." 
    },
  ];

  // --- 2. STATES ---
  const [customer, setCustomer] = useState({ name: '', phone: '', date: '', shift: 'Tối', guests: 200 });
  
  // Quản lý Sảnh
  const [selectedHall, setSelectedHall] = useState(null);
  const [activeHallType, setActiveHallType] = useState("Tất cả");

  // Quản lý Thực đơn
  const [menuMode, setMenuMode] = useState('set'); 
  const [selectedSet, setSelectedSet] = useState(null); 
  const [selectedSingleItems, setSelectedSingleItems] = useState([]); 
  const [singleItemTab, setSingleItemTab] = useState('Khai vị'); 

  // Quản lý Dịch vụ
  const [selectedServices, setSelectedServices] = useState([]);

  // Quản lý Tài chính (Mới)
  const [deposit, setDeposit] = useState(0); // Tiền đặt cọc

  // --- 3. HANDLERS ---
  
  const filteredHalls = activeHallType === "Tất cả" ? halls : halls.filter(h => h.type === activeHallType);

  const handleSelectSet = (set) => {
    if (selectedSet?.id === set.id) setSelectedSet(null);
    else setSelectedSet(set);
  };

  const toggleSingleItem = (item) => {
    const exists = selectedSingleItems.find(i => i.id === item.id);
    if (exists) setSelectedSingleItems(selectedSingleItems.filter(i => i.id !== item.id));
    else setSelectedSingleItems([...selectedSingleItems, item]);
  };

  const toggleService = (srv) => {
    const exists = selectedServices.find(s => s.id === srv.id);
    if (exists) setSelectedServices(selectedServices.filter(s => s.id !== srv.id));
    else setSelectedServices([...selectedServices, srv]);
  };

  // --- 4. TÍNH TOÁN TIỀN (CALCULATIONS) ---
  const calculateTotal = () => {
    const hallPrice = selectedHall ? selectedHall.price : 0;
    const tables = Math.ceil(customer.guests / 10);

    const setPrice = selectedSet ? selectedSet.price : 0;
    const singleItemsPrice = selectedSingleItems.reduce((acc, curr) => acc + curr.price, 0);
    const menuPricePerTable = setPrice + singleItemsPrice;
    
    const totalMenuPrice = menuPricePerTable * tables;
    const totalServicePrice = selectedServices.reduce((acc, curr) => acc + curr.price, 0);

    const grandTotal = hallPrice + totalMenuPrice + totalServicePrice;
    const remaining = grandTotal - deposit; // Tính tiền còn lại

    return {
        hall: hallPrice,
        menuPerTable: menuPricePerTable,
        tables: tables,
        totalMenu: totalMenuPrice,
        service: totalServicePrice,
        grandTotal: grandTotal,
        remaining: remaining > 0 ? remaining : 0 // Không để số âm
    };
  };

  const totals = calculateTotal();
  const fmt = (num) => num.toLocaleString('vi-VN') + ' đ';

  return (
    <div className="mb-wrapper">
      <div className="mb-header">
        <h2><FaLayerGroup /> Đặt Tiệc (Manager Mode)</h2>
        <div className="mb-booking-id">#BK-NEW</div>
      </div>

      <div className="mb-container">
        
        {/* === CỘT TRÁI: KHU VỰC CHỌN === */}
        <div className="mb-main">
            
            {/* 1. THÔNG TIN KHÁCH */}
            <section className="mb-card">
                <div className="mb-card-header">
                    <h3><FaUser/> Thông tin khách hàng</h3>
                </div>
                <div className="mb-form-row">
                    <div className="mb-input">
                        <label>Tên khách hàng</label>
                        <input type="text" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} />
                    </div>
                    <div className="mb-input">
                        <label>Số điện thoại</label>
                        <input type="text" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} />
                    </div>
                    <div className="mb-input">
                        <label>Ca tổ chức</label>
                        <select value={customer.shift} onChange={e => setCustomer({...customer, shift: e.target.value})}>
                            <option>Sáng (9:00 - 13:00)</option>
                            <option>Tối (17:00 - 21:00)</option>
                        </select>
                    </div>
                    <div className="mb-input">
                        <label>Ngày tổ chức</label>
                        <input type="date" value={customer.date} onChange={e => setCustomer({...customer, date: e.target.value})} />
                    </div>
                    <div className="mb-input">
                        <label>Số lượng khách</label>
                        <div className="guest-input-group">
                            <input type="number" value={customer.guests} onChange={e => setCustomer({...customer, guests: parseInt(e.target.value) || 0})} />
                            <span className="table-calc">≈ {totals.tables} bàn</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. CHỌN SẢNH */}
            <section className="mb-card">
                <div className="mb-card-header with-filter">
                    <h3><FaCalendarAlt/> Chọn Sảnh Tiệc</h3>
                    <div className="hall-type-tabs">
                        {hallTypes.map(type => (
                            <button key={type} className={`type-btn ${activeHallType === type ? 'active' : ''}`} onClick={() => setActiveHallType(type)}>{type}</button>
                        ))}
                    </div>
                </div>
                <div className="mb-halls-list">
                    {filteredHalls.map(hall => (
                        <div key={hall.id} className={`mb-hall-item ${selectedHall?.id === hall.id ? 'selected' : ''}`} onClick={() => setSelectedHall(hall)}>
                            <img src={hall.image} alt={hall.name} />
                            <div className="hall-details">
                                <h4>{hall.name}</h4>
                                <span className="hall-badge">{hall.type}</span>
                                <p className="hall-desc-text">{hall.desc}</p>
                                <div className="hall-specs">
                                    <span><FaUsers/> {hall.capacity} khách</span>
                                    <span className="price">{fmt(hall.price)}</span>
                                </div>
                            </div>
                            {selectedHall?.id === hall.id && <div className="check-icon"><FaCheckCircle/></div>}
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. CHỌN THỰC ĐƠN */}
            <section className="mb-card">
                <div className="mb-card-header with-filter">
                    <h3><FaUtensils/> Thực Đơn Tiệc</h3>
                    <div className="menu-mode-switch">
                        <button className={`mode-btn ${menuMode === 'set' ? 'active' : ''}`} onClick={() => setMenuMode('set')}>Chọn theo Set</button>
                        <button className={`mode-btn ${menuMode === 'single' ? 'active' : ''}`} onClick={() => setMenuMode('single')}>Chọn món lẻ</button>
                    </div>
                </div>
                
                {menuMode === 'set' && (
                    <div className="mb-set-grid">
                        {setMenus.map(set => (
                            <div key={set.id} className={`mb-set-card ${selectedSet?.id === set.id ? 'selected' : ''}`} onClick={() => handleSelectSet(set)}>
                                {/* Hình ảnh cho Set */}
                                <div className="set-img-wrapper">
                                    <img src={set.image} alt={set.name} />
                                    {selectedSet?.id === set.id && <div className="check-corner"><FaCheckCircle/></div>}
                                </div>
                                <div className="set-content">
                                    <div className="set-header">
                                        <h4>{set.name}</h4>
                                        <span className="set-price">{fmt(set.price)}/bàn</span>
                                    </div>
                                    <p className="set-desc">{set.desc}</p>
                                    <ul className="set-items">
                                        {set.items.map((item, idx) => <li key={idx}>• {item}</li>)}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {menuMode === 'single' && (
                    <>
                        <div className="single-item-tabs">
                            {['Khai vị', 'Món chính', 'Tráng miệng'].map(t => (
                                <button key={t} className={`sub-tab-btn ${singleItemTab === t ? 'active' : ''}`} onClick={() => setSingleItemTab(t)}>{t}</button>
                            ))}
                        </div>
                        <div className="mb-menu-grid">
                            {singleItems.filter(i => i.type === singleItemTab).map(dish => (
                                <div key={dish.id} className={`mb-dish-item ${selectedSingleItems.find(d => d.id === dish.id) ? 'selected' : ''}`} onClick={() => toggleSingleItem(dish)}>
                                    <div className="dish-details simple">
                                        <h5>{dish.name}</h5>
                                        <span className="dish-type">{dish.type}</span>
                                        <p className="price">{fmt(dish.price)}</p>
                                    </div>
                                    {selectedSingleItems.find(d => d.id === dish.id) ? <FaMinusCircle className="action-icon remove"/> : <FaPlusCircle className="action-icon add"/>}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* 4. DỊCH VỤ (CÓ ẢNH & MÔ TẢ) */}
            <section className="mb-card">
                <div className="mb-card-header">
                    <h3><FaMusic/> Dịch Vụ Khác</h3>
                </div>
                {/* Sử dụng Grid mới cho dịch vụ có ảnh */}
                <div className="mb-services-grid-img">
                    {services.map(srv => (
                        <div 
                            key={srv.id} 
                            className={`mb-service-card-img ${selectedServices.find(s => s.id === srv.id) ? 'selected' : ''}`}
                            onClick={() => toggleService(srv)}
                        >
                            <div className="srv-img-wrapper">
                                <img src={srv.image} alt={srv.name} />
                                {selectedServices.find(s => s.id === srv.id) && (
                                    <div className="srv-overlay"><FaCheckCircle/></div>
                                )}
                            </div>
                            <div className="srv-content">
                                <h4>{srv.name}</h4>
                                <p className="srv-desc" title={srv.desc}>{srv.desc}</p>
                                <span className="srv-price">{fmt(srv.price)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>

        {/* === CỘT PHẢI: HÓA ĐƠN & CỌC (STICKY) === */}
        <div className="mb-sidebar">
            <div className="mb-bill-panel">
                <div className="bill-top">
                    <h4>CHI TIẾT TẠM TÍNH</h4>
                </div>
                
                <div className="bill-content">
                    {/* Thông tin chung */}
                    <div className="bill-customer-info">
                        <p><strong>Khách:</strong> {customer.name || "---"}</p>
                        <p><strong>Liên hệ:</strong> {customer.phone || "---"}</p>
                        <p><strong>Ca tổ chức:</strong> {customer.shift || "---"}</p>
                        <p><strong>Ngày:</strong> {customer.date || "---"} - {customer.shift || "---"}</p>
                        <p><strong>Quy mô:</strong> {customer.guests} khách ({totals.tables} bàn)</p>
                    </div>
                    <div className="divider"></div>

                    {/* 1. SẢNH */}
                    <div className="bill-section-title">1. TIỀN SẢNH</div>
                    {selectedHall ? (
                        <div className="bill-item-row">
                            <span>{selectedHall.name}</span>
                            <span>{fmt(selectedHall.price)}</span>
                        </div>
                    ) : <div className="bill-empty">Chưa chọn sảnh</div>}

                    {/* 2. THỰC ĐƠN */}
                    <div className="bill-section-title">2. THỰC ĐƠN</div>
                    {selectedSet && (
                        <div className="bill-sub-item highlight">
                            <span><strong>SET: {selectedSet.name}</strong></span>
                            <span>{fmt(selectedSet.price)}</span>
                        </div>
                    )}
                    {selectedSingleItems.length > 0 && selectedSingleItems.map(d => (
                        <div key={d.id} className="bill-sub-item">
                            <span>+ {d.name}</span>
                            <span>{fmt(d.price)}</span>
                        </div>
                    ))}
                    {(selectedSet || selectedSingleItems.length > 0) ? (
                        <>
                            <div className="bill-item-row highlight mt-2">
                                <span>Giá 1 bàn:</span>
                                <span>{fmt(totals.menuPerTable)}</span>
                            </div>
                            <div className="bill-item-row total-sub">
                                <span>Thành tiền ({totals.tables} bàn):</span>
                                <span>{fmt(totals.totalMenu)}</span>
                            </div>
                        </>
                    ) : <div className="bill-empty">Chưa chọn món</div>}

                    {/* 3. DỊCH VỤ */}
                    <div className="bill-section-title">3. DỊCH VỤ</div>
                    {selectedServices.map(s => (
                        <div key={s.id} className="bill-item-row">
                            <span>{s.name}</span>
                            <span>{fmt(s.price)}</span>
                        </div>
                    ))}
                    {selectedServices.length > 0 && (
                         <div className="bill-item-row total-sub">
                            <span>Tổng dịch vụ:</span>
                            <span>{fmt(totals.service)}</span>
                        </div>
                    )}

                    <div className="divider-bold"></div>
                    
                    {/* TỔNG CỘNG */}
                    <div className="bill-row-large">
                        <span>Tổng cộng:</span>
                        <span>{fmt(totals.grandTotal)}</span>
                    </div>

                    {/* KHU VỰC NHẬP TIỀN CỌC */}
                    <div className="payment-control-box">
                        <div className="control-row">
                            <label className="deposit-label">Đặt cọc (Deposit):</label>
                            <input 
                                type="number" 
                                className="deposit-input"
                                placeholder="0" 
                                value={deposit} 
                                onChange={(e) => setDeposit(Number(e.target.value))} 
                            />
                        </div>
                    </div>

                    <div className="divider"></div>

                    {/* CÒN LẠI */}
                    <div className="bill-grand-total remaining">
                        <span>CÒN LẠI:</span>
                        <span className="money">{fmt(totals.remaining)}</span>
                    </div>
                    <div className="payment-status-text">
                        {deposit > 0 ? (
                            <span className="text-success"><FaCheckCircle/> Đã cọc {fmt(deposit)}</span>
                        ) : (
                            <span className="text-warning"><FaInfoCircle/> Chưa đặt cọc</span>
                        )}
                    </div>
                </div>

                <div className="bill-actions">
                    <button className="btn-confirm-booking"><FaMoneyBillWave /> XÁC NHẬN ĐẶT TIỆC</button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ManagerBooking;