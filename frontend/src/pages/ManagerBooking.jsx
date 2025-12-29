import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './ManagerBooking.css';
import { 
  FaUser, FaCalendarAlt, FaUsers, FaCheckCircle, 
  FaUtensils, FaMusic, FaLayerGroup, FaMoneyBillWave, 
  FaPlusCircle, FaMinusCircle, FaInfoCircle, FaCheck 
} from "react-icons/fa";

const ManagerBooking = () => {
  // --- 1. DỮ LIỆU TỪ DATABASE ---
  const [danhSachCa, setDanhSachCa] = useState([]);
  const [danhSachSanh, setDanhSachSanh] = useState([]);
  const [danhSachLoaiSanh, setDanhSachLoaiSanh] = useState([]);
  const [danhSachThucDonMau, setDanhSachThucDonMau] = useState([]);
  const [danhSachMonAn, setDanhSachMonAn] = useState([]);
  const [danhSachLoaiMonAn, setDanhSachLoaiMonAn] = useState([]);
  const [danhSachDichVu, setDanhSachDichVu] = useState([]);
  // Ảnh đại diện cho set (lấy từ món trong set)
  const [repImageBySet, setRepImageBySet] = useState({});
  // Danh sách tên món theo từng set
  const [monAnBySet, setMonAnBySet] = useState({});

  // --- 2. STATES ---
  const [customer, setCustomer] = useState({ 
    tenChuRe: '', 
    tenCoDau: '',
    phone: '', 
    date: '', 
    maCa: '', 
    guests: 200,
    soBanDuTru: 0
  });
  
  // Quản lý Sảnh
  const [selectedHall, setSelectedHall] = useState(null);
  const [activeHallType, setActiveHallType] = useState("Tất cả");

  // Quản lý Thực đơn
  const [menuMode, setMenuMode] = useState('set'); 
  const [selectedSet, setSelectedSet] = useState(null); 
  const [selectedSingleItems, setSelectedSingleItems] = useState([]); 
  const [singleItemTab, setSingleItemTab] = useState(null); 

  // Quản lý Dịch vụ
  const [selectedServices, setSelectedServices] = useState([]);

  // Quản lý Tài chính
  const [deposit, setDeposit] = useState(0);

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // --- 3. LOAD DATA FROM API ---
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [ca, sanh, loaiSanh, thucDonMau, monAn, loaiMonAn, dichVu] = await Promise.all([
        apiService.getCa(),
        apiService.getSanh(),
        apiService.getLoaiSanh(),
        apiService.getAllThucDonMau(),
        apiService.getAllMonAn(),
        apiService.getAllLoaiMonAn(),
        apiService.getAllDichVu()
      ]);

      setDanhSachCa(ca.data || []);
      setDanhSachSanh(sanh.data || []);
      setDanhSachLoaiSanh(loaiSanh.data || []);
      setDanhSachThucDonMau(thucDonMau.data || []);
      setDanhSachMonAn(monAn.data || []);
      setDanhSachLoaiMonAn(loaiMonAn.data || []);
      setDanhSachDichVu(dichVu.data || []);
      
      // Set default single item tab
      if (loaiMonAn.data && loaiMonAn.data.length > 0) {
        setSingleItemTab(loaiMonAn.data[0].MaLoaiMonAn);
      }
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Sau khi có danh sách thực đơn mẫu, lấy ảnh đại diện từ món trong set
  useEffect(() => {
    const loadRepresentativeImages = async () => {
      try {
        const sets = danhSachThucDonMau || [];
        if (sets.length === 0) return;
        const repMap = {};
        const dishesMap = {};
        await Promise.all(
          sets.map(async (set) => {
            try {
              const res = await apiService.getMonAnThucDonMau(set.MaThucDon);
              const list = res.data || [];
              const firstWithImage = list.find(m => !!m.AnhURL);
              if (firstWithImage?.AnhURL) {
                repMap[set.MaThucDon] = firstWithImage.AnhURL;
              }
              dishesMap[set.MaThucDon] = list.map(m => m.TenMonAn).filter(Boolean);
            } catch {
              // bỏ qua lỗi từng set
            }
          })
        );
        setRepImageBySet(repMap);
        setMonAnBySet(dishesMap);
      } catch {
        // ignore
      }
    };
    loadRepresentativeImages();
  }, [danhSachThucDonMau]);

  // --- 4. HANDLERS ---
  
  // Get hall types for filtering
  const hallTypes = ["Tất cả", ...danhSachLoaiSanh.map(ls => ls.TenLoaiSanh)];
  
  const filteredHalls = activeHallType === "Tất cả" 
    ? danhSachSanh 
    : danhSachSanh.filter(h => {
        const loaiSanh = danhSachLoaiSanh.find(ls => ls.MaLoaiSanh === h.MaLoaiSanh);
        return loaiSanh?.TenLoaiSanh === activeHallType;
      });

  const handleSelectSet = (set) => {
    if (selectedSet?.MaThucDon === set.MaThucDon) {
      setSelectedSet(null);
    } else {
      setSelectedSet(set);
      // Clear single items when selecting set
      setSelectedSingleItems([]);
    }
  };

  const toggleSingleItem = (item) => {
    const exists = selectedSingleItems.find(i => i.MaMonAn === item.MaMonAn);
    if (exists) {
      setSelectedSingleItems(selectedSingleItems.filter(i => i.MaMonAn !== item.MaMonAn));
    } else {
      setSelectedSingleItems([...selectedSingleItems, item]);
      // Clear set when selecting individual items
      setSelectedSet(null);
    }
  };

  const toggleService = (srv) => {
    const exists = selectedServices.find(s => s.MaDichVu === srv.MaDichVu);
    if (exists) {
      setSelectedServices(selectedServices.filter(s => s.MaDichVu !== srv.MaDichVu));
    } else {
      setSelectedServices([...selectedServices, { ...srv, soLuong: 1 }]);
    }
  };

  const handleServiceQuantityChange = (maDichVu, soLuong) => {
    setSelectedServices(prev => prev.map(s => 
      s.MaDichVu === maDichVu ? { ...s, soLuong: parseInt(soLuong) || 1 } : s
    ));
  };

  // --- 5. TÍNH TOÁN TIỀN (CALCULATIONS) ---
  const calculateTotal = () => {
    // FIXED: Lấy giá sảnh từ LOAISANH, không phải từ SANH
    // Parse sang số để tránh nối chuỗi
    const loaiSanh = selectedHall 
      ? danhSachLoaiSanh.find(ls => ls.MaLoaiSanh === selectedHall.MaLoaiSanh) 
      : null;
    const hallPrice = loaiSanh ? parseFloat(loaiSanh.DonGiaBanToiThieu || 0) : 0;
    
    const tables = Math.ceil(customer.guests / 10);
    const reserveTables = parseInt(customer.soBanDuTru || 0);
    const totalTables = tables + reserveTables;

    // Parse tất cả giá trị sang số
    const setPrice = selectedSet ? parseFloat(selectedSet.DonGiaHienTai || 0) : 0;
    const singleItemsPrice = selectedSingleItems.reduce((acc, curr) => 
      acc + parseFloat(curr.DonGia || 0), 0
    );
    const menuPricePerTable = setPrice + singleItemsPrice;
    
    const totalMenuPrice = menuPricePerTable * totalTables;
    const totalServicePrice = selectedServices.reduce((acc, curr) => 
      acc + (parseFloat(curr.DonGia || 0) * parseInt(curr.soLuong || 1)), 0
    );

    const grandTotal = hallPrice + totalMenuPrice + totalServicePrice;
    const remaining = grandTotal - parseFloat(deposit || 0);

    return {
        hall: hallPrice,
        menuPerTable: menuPricePerTable,
        tables: tables,
        reserveTables: reserveTables,
        totalTables: totalTables,
        totalMenu: totalMenuPrice,
        service: totalServicePrice,
        grandTotal: grandTotal,
        remaining: remaining > 0 ? remaining : 0
    };
  };

  const totals = calculateTotal();
  const fmt = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(num || 0)).replace('₫', 'đ');

  // --- 6. SUBMIT HANDLER ---
  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Validate
      if (!customer.tenChuRe || !customer.tenCoDau || !customer.phone) {
        throw new Error('Vui lòng điền đầy đủ thông tin khách hàng');
      }

      if (!customer.date || !customer.maCa || !selectedHall) {
        throw new Error('Vui lòng chọn đầy đủ thông tin tiệc');
      }

      if (!selectedSet && selectedSingleItems.length === 0) {
        throw new Error('Vui lòng chọn thực đơn');
      }

      // Step 1: Create ThucDon
      let maThucDon;
      let danhSachMonAn = [];
      
      if (selectedSet) {
        // Get món ăn from template
        const monAnFromTemplate = await apiService.getMonAnThucDonMau(selectedSet.MaThucDon);
        danhSachMonAn = monAnFromTemplate.data || [];
        
        // Tính tổng giá từ danh sách món ăn thực tế
        const tongDonGia = danhSachMonAn.reduce((sum, monAn) => 
          sum + parseFloat(monAn.DonGia || 0), 0
        );

        // Create new ThucDon
        const thucDonResult = await apiService.createThucDon({
          tenThucDon: `Thực đơn ${customer.tenChuRe} & ${customer.tenCoDau}`,
          donGiaHienTai: tongDonGia,
          ghiChu: `Tạo từ thực đơn mẫu: ${selectedSet.TenThucDon || ''}`
        });
        
        maThucDon = thucDonResult.data.MaThucDon;

        // Add món ăn to ThucDon
        for (const monAn of danhSachMonAn) {
          await apiService.addMonAnToThucDon(maThucDon, {
            maMonAn: monAn.MaMonAn,
            donGiaThoiDiemDat: monAn.DonGia
          });
        }
      } else {
        // Individual dishes mode
        danhSachMonAn = selectedSingleItems;
        
        const tongDonGia = danhSachMonAn.reduce((sum, monAn) => 
          sum + parseFloat(monAn.DonGia || 0), 0
        );

        // Create new ThucDon
        const thucDonResult = await apiService.createThucDon({
          tenThucDon: `Thực đơn ${customer.tenChuRe} & ${customer.tenCoDau}`,
          donGiaHienTai: tongDonGia,
          ghiChu: 'Tạo từ chọn món lẻ'
        });
        
        maThucDon = thucDonResult.data.MaThucDon;

        // Add món ăn to ThucDon
        for (const monAn of danhSachMonAn) {
          await apiService.addMonAnToThucDon(maThucDon, {
            maMonAn: monAn.MaMonAn,
            donGiaThoiDiemDat: monAn.DonGia
          });
        }
      }

      // Step 2: Create DatTiec
      const datTiecData = {
        tenChuRe: customer.tenChuRe,
        tenCoDau: customer.tenCoDau,
        dienThoai: customer.phone,
        ngayDatTiec: new Date().toISOString().split('T')[0],
        ngayDaiTiec: customer.date,
        maCa: parseInt(customer.maCa),
        maSanh: selectedHall.MaSanh,
        maThucDon: maThucDon,
        tienDatCoc: parseFloat(deposit),
        tongTienDuKien: parseFloat(totals.grandTotal),
        soLuongBan: totals.tables,
        soBanDuTru: parseInt(customer.soBanDuTru)
      };

      const datTiecResult = await apiService.createDatTiec(datTiecData);
      const maDatTiec = datTiecResult.data.MaDatTiec;

      // Step 3: Add services to DatTiec
      for (const dichVu of selectedServices) {
        await apiService.addDichVuToDatTiec(maDatTiec, {
          maDichVu: dichVu.MaDichVu,
          soLuong: dichVu.soLuong,
          donGiaThoiDiemDat: dichVu.DonGia
        });
      }

      setSuccess(`Đặt tiệc thành công! Mã đặt tiệc: #${maDatTiec}`);
      
      // Reset form
      setCustomer({
        tenChuRe: '',
        tenCoDau: '',
        phone: '',
        date: '',
        maCa: '',
        guests: 200,
        soBanDuTru: 0
      });
      setSelectedHall(null);
      setSelectedSet(null);
      setSelectedSingleItems([]);
      setSelectedServices([]);
      setDeposit(0);

    } catch (err) {
      setError(err.message || 'Đặt tiệc thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (loading && danhSachCa.length === 0) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="management-container">
      <div className="mb-header">
        <h2><FaLayerGroup /> Đặt Tiệc (Manager Mode)</h2>
        <div className="mb-booking-id">#BK-NEW</div>
      </div>

      {error && <div className="alert alert-error" style={{margin: '20px', padding: '15px', background: '#ffebee', color: '#c62828', borderRadius: '8px'}}>{error}</div>}
      {success && <div className="alert alert-success" style={{margin: '20px', padding: '15px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '8px'}}>{success}</div>}

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
                        <label>Tên chú rể</label>
                        <input 
                          type="text" 
                          value={customer.tenChuRe} 
                          onChange={e => setCustomer({...customer, tenChuRe: e.target.value})} 
                          placeholder="Nhập tên chú rể"
                        />
                    </div>
                    <div className="mb-input">
                        <label>Tên cô dâu</label>
                        <input 
                          type="text" 
                          value={customer.tenCoDau} 
                          onChange={e => setCustomer({...customer, tenCoDau: e.target.value})} 
                          placeholder="Nhập tên cô dâu"
                        />
                    </div>
                    <div className="mb-input">
                        <label>Số điện thoại</label>
                        <input 
                          type="text" 
                          value={customer.phone} 
                          onChange={e => setCustomer({...customer, phone: e.target.value})} 
                          placeholder="10-11 chữ số"
                        />
                    </div>
                    <div className="mb-input">
                        <label>Ca tổ chức</label>
                        <select 
                          value={customer.maCa} 
                          onChange={e => setCustomer({...customer, maCa: e.target.value})}
                        >
                            <option value="">-- Chọn ca --</option>
                            {danhSachCa.map(ca => (
                              <option key={ca.MaCa} value={ca.MaCa}>{ca.TenCa}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-input">
                        <label>Ngày tổ chức</label>
                        <input 
                          type="date" 
                          value={customer.date} 
                          onChange={e => setCustomer({...customer, date: e.target.value})} 
                          min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div className="mb-input">
                        <label>Số lượng khách</label>
                        <div className="guest-input-group">
                            <input 
                              type="number" 
                              value={customer.guests} 
                              onChange={e => setCustomer({...customer, guests: parseInt(e.target.value) || 0})} 
                              min="1"
                            />
                            <span className="table-calc">≈ {totals.tables} bàn</span>
                        </div>
                    </div>
                    <div className="mb-input">
                        <label>Số bàn dự trữ</label>
                        <input 
                          type="number" 
                          value={customer.soBanDuTru} 
                          onChange={e => setCustomer({...customer, soBanDuTru: parseInt(e.target.value) || 0})} 
                          min="0"
                        />
                    </div>
                </div>
            </section>

            {/* 2. CHỌN SẢNH */}
            <section className="mb-card">
                <div className="mb-card-header with-filter">
                    <h3><FaCalendarAlt/> Chọn Sảnh Tiệc</h3>
                    <div className="hall-type-tabs">
                        {hallTypes.map(type => (
                            <button 
                              key={type} 
                              className={`type-btn ${activeHallType === type ? 'active' : ''}`} 
                              onClick={() => setActiveHallType(type)}
                            >
                              {type}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-halls-list">
                    {filteredHalls.map(hall => {
                        const loaiSanh = danhSachLoaiSanh.find(ls => ls.MaLoaiSanh === hall.MaLoaiSanh);
                        return (
                          <div 
                            key={hall.MaSanh} 
                            className={`mb-hall-item ${selectedHall?.MaSanh === hall.MaSanh ? 'selected' : ''}`} 
                            onClick={() => setSelectedHall(hall)}
                          >
                              {hall.AnhURL && <img src={hall.AnhURL} alt={hall.TenSanh} />}
                              {!hall.AnhURL && <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600" alt={hall.TenSanh} />}
                              <div className="hall-details">
                                  <h4>{hall.TenSanh}</h4>
                                  <span className="hall-badge">{loaiSanh?.TenLoaiSanh || 'N/A'}</span>
                                  <p className="hall-desc-text">{hall.GhiChu || 'Không gian sang trọng, phù hợp tổ chức tiệc cưới'}</p>
                                  <div className="hall-specs">
                                      <span><FaUsers/> {hall.SoLuongBanToiDa * 10} khách</span>
                                      <span className="price">{fmt(loaiSanh?.DonGiaBanToiThieu || 0)}</span>
                                  </div>
                              </div>
                              {selectedHall?.MaSanh === hall.MaSanh && <div className="check-icon"><FaCheckCircle/></div>}
                          </div>
                        );
                    })}
                </div>
            </section>

            {/* 3. CHỌN THỰC ĐƠN */}
            <section className="mb-card">
                <div className="mb-card-header with-filter">
                    <h3><FaUtensils/> Thực Đơn Tiệc</h3>
                    <div className="menu-mode-switch">
                        <button 
                          className={`mode-btn ${menuMode === 'set' ? 'active' : ''}`} 
                          onClick={() => setMenuMode('set')}
                        >
                          Chọn theo Set
                        </button>
                        <button 
                          className={`mode-btn ${menuMode === 'single' ? 'active' : ''}`} 
                          onClick={() => setMenuMode('single')}
                        >
                          Chọn món lẻ
                        </button>
                    </div>
                </div>
                
                {menuMode === 'set' && (
                    <div className="mb-set-grid">
                        {danhSachThucDonMau.map(set => (
                            <div 
                              key={set.MaThucDon} 
                              className={`mb-set-card ${selectedSet?.MaThucDon === set.MaThucDon ? 'selected' : ''}`} 
                              onClick={() => handleSelectSet(set)}
                            >
                                <div className="set-img-wrapper">
                                    { (set.AnhURL || repImageBySet[set.MaThucDon]) ? (
                                      <img src={set.AnhURL || repImageBySet[set.MaThucDon]} alt={set.TenThucDon} />
                                    ) : (
                                      <img src="https://images.unsplash.com/photo-1555126634-323283e090fa?w=400" alt={set.TenThucDon} />
                                    ) }
                                    {selectedSet?.MaThucDon === set.MaThucDon && <div className="check-corner"><FaCheck/></div>}
                                </div>
                                <div className="set-content">
                                    <div className="set-header">
                                        <h4>{set.TenThucDon}</h4>
                                        <span className="set-price">{fmt(set.DonGiaHienTai || 0)}/bàn</span>
                                    </div>
                                    <p className="set-desc">{set.GhiChu || 'Thực đơn trọn gói cho tiệc cưới'}</p>
                                    <p className="set-dishes">Món: {monAnBySet[set.MaThucDon]?.slice(0,6).join(', ') || 'Đang tải...'}{monAnBySet[set.MaThucDon] && monAnBySet[set.MaThucDon].length > 6 ? '...' : ''}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {menuMode === 'single' && (
                    <>
                        <div className="single-item-tabs">
                            {danhSachLoaiMonAn.map(loai => (
                                <button 
                                  key={loai.MaLoaiMonAn} 
                                  className={`sub-tab-btn ${singleItemTab === loai.MaLoaiMonAn ? 'active' : ''}`} 
                                  onClick={() => setSingleItemTab(loai.MaLoaiMonAn)}
                                >
                                  {loai.TenLoaiMonAn}
                                </button>
                            ))}
                        </div>
                        <div className="mb-menu-grid">
                            {danhSachMonAn
                              .filter(mon => mon.MaLoaiMonAn === singleItemTab)
                              .map(dish => (
                                <div 
                                  key={dish.MaMonAn} 
                                  className={`mb-dish-item ${selectedSingleItems.find(d => d.MaMonAn === dish.MaMonAn) ? 'selected' : ''}`} 
                                  onClick={() => toggleSingleItem(dish)}
                                >
                                    <div className="dish-details simple">
                                        <h5>{dish.TenMonAn}</h5>
                                        <span className="dish-type">{danhSachLoaiMonAn.find(l => l.MaLoaiMonAn === dish.MaLoaiMonAn)?.TenLoaiMonAn}</span>
                                        <p className="price">{fmt(dish.DonGia || 0)}</p>
                                    </div>
                                    {selectedSingleItems.find(d => d.MaMonAn === dish.MaMonAn) 
                                      ? <FaMinusCircle className="action-icon remove"/> 
                                      : <FaPlusCircle className="action-icon add"/>
                                    }
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* 4. DỊCH VỤ */}
            <section className="mb-card">
                <div className="mb-card-header">
                    <h3><FaMusic/> Dịch Vụ Khác</h3>
                </div>
                <div className="mb-services-grid-img">
                    {danhSachDichVu.map(srv => {
                        const selected = selectedServices.find(s => s.MaDichVu === srv.MaDichVu);
                        return (
                          <div 
                            key={srv.MaDichVu} 
                            className={`mb-service-card-img ${selected ? 'selected' : ''}`}
                            onClick={() => toggleService(srv)}
                          >
                              <div className="srv-img-wrapper">
                                  {srv.AnhURL && <img src={srv.AnhURL} alt={srv.TenDichVu} />}
                                  {!srv.AnhURL && <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400" alt={srv.TenDichVu} />}
                                  {selected && (
                                      <div className="srv-overlay"><FaCheckCircle/></div>
                                  )}
                              </div>
                              <div className="srv-content">
                                  <h4>{srv.TenDichVu}</h4>
                                  <p className="srv-desc" title={srv.GhiChu}>{srv.GhiChu || 'Dịch vụ chất lượng cao'}</p>
                                  <span className="srv-price">{fmt(srv.DonGia || 0)}</span>
                                  {selected && (
                                    <div className="service-quantity-inline" onClick={(e) => e.stopPropagation()}>
                                      <label>SL:</label>
                                      <input 
                                        type="number" 
                                        value={selected.soLuong} 
                                        onChange={(e) => handleServiceQuantityChange(srv.MaDichVu, e.target.value)}
                                        min="1"
                                      />
                                    </div>
                                  )}
                              </div>
                          </div>
                        );
                    })}
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
                        <p><strong>Chú rể:</strong> {customer.tenChuRe || "---"}</p>
                        <p><strong>Cô dâu:</strong> {customer.tenCoDau || "---"}</p>
                        <p><strong>Liên hệ:</strong> {customer.phone || "---"}</p>
                        <p><strong>Ca:</strong> {danhSachCa.find(c => c.MaCa === parseInt(customer.maCa))?.TenCa || "---"}</p>
                        <p><strong>Ngày:</strong> {customer.date || "---"}</p>
                        <p><strong>Quy mô:</strong> {customer.guests} khách ({totals.tables} bàn + {totals.reserveTables} dự trữ = {totals.totalTables} bàn)</p>
                    </div>
                    <div className="divider"></div>

                    {/* 1. SẢNH */}
                    <div className="bill-section-title">1. TIỀN SẢNH</div>
                    {selectedHall ? (
                        <div className="bill-item-row">
                            <span>{selectedHall.TenSanh}</span>
                            <span>{fmt(danhSachLoaiSanh.find(ls => ls.MaLoaiSanh === selectedHall.MaLoaiSanh)?.DonGiaBanToiThieu || 0)}</span>
                        </div>
                    ) : <div className="bill-empty">Chưa chọn sảnh</div>}

                    {/* 2. THỰC ĐƠN */}
                    <div className="bill-section-title">2. THỰC ĐƠN</div>
                    {selectedSet && (
                        <div className="bill-sub-item highlight">
                            <span><strong>SET: {selectedSet.TenThucDon}</strong></span>
                            <span>{fmt(selectedSet.DonGiaHienTai || 0)}</span>
                        </div>
                    )}
                    {selectedSingleItems.length > 0 && selectedSingleItems.map(d => (
                        <div key={d.MaMonAn} className="bill-sub-item">
                            <span>+ {d.TenMonAn}</span>
                            <span>{fmt(d.DonGia || 0)}</span>
                        </div>
                    ))}
                    {(selectedSet || selectedSingleItems.length > 0) ? (
                        <>
                            <div className="bill-item-row highlight mt-2">
                                <span>Giá 1 bàn:</span>
                                <span>{fmt(totals.menuPerTable)}</span>
                            </div>
                            <div className="bill-item-row total-sub">
                                <span>Thành tiền ({totals.totalTables} bàn):</span>
                                <span>{fmt(totals.totalMenu)}</span>
                            </div>
                        </>
                    ) : <div className="bill-empty">Chưa chọn món</div>}

                    {/* 3. DỊCH VỤ */}
                    <div className="bill-section-title">3. DỊCH VỤ</div>
                    {selectedServices.map(s => (
                        <div key={s.MaDichVu} className="bill-item-row">
                            <span>{s.TenDichVu} (x{s.soLuong})</span>
                            <span>{fmt((s.DonGia || 0) * (s.soLuong || 1))}</span>
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
                    <button 
                      className="btn-confirm-booking" 
                      onClick={handleConfirmBooking}
                      disabled={loading}
                    >
                      <FaMoneyBillWave /> {loading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐẶT TIỆC'}
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ManagerBooking;