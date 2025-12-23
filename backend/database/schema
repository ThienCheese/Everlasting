-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.BAOCAODOANHSO (
  MaBaoCaoDoanhSo integer NOT NULL DEFAULT nextval('"BAOCAODOANHSO_MaBaoCaoDoanhSo_seq"'::regclass),
  Thang integer NOT NULL CHECK ("Thang" >= 1 AND "Thang" <= 12),
  Nam integer NOT NULL,
  TongDoanhThu numeric NOT NULL CHECK ("TongDoanhThu" >= 0::numeric),
  CONSTRAINT BAOCAODOANHSO_pkey PRIMARY KEY (MaBaoCaoDoanhSo)
);
CREATE TABLE public.CA (
  MaCa integer NOT NULL DEFAULT nextval('"CA_MaCa_seq"'::regclass),
  TenCa character varying NOT NULL,
  DaXoa boolean NOT NULL DEFAULT false,
  CONSTRAINT CA_pkey PRIMARY KEY (MaCa)
);
CREATE TABLE public.CHITIET_BAOCAODOANHSO (
  MaBaoCaoDoanhSo integer NOT NULL,
  Ngay date NOT NULL,
  SoLuongTiec integer NOT NULL CHECK ("SoLuongTiec" >= 0),
  DoanhThu numeric NOT NULL CHECK ("DoanhThu" >= 0::numeric),
  TiLe numeric NOT NULL CHECK ("TiLe" >= 0::numeric AND "TiLe" <= 100::numeric),
  CONSTRAINT CHITIET_BAOCAODOANHSO_pkey PRIMARY KEY (MaBaoCaoDoanhSo, Ngay),
  CONSTRAINT CHITIET_BAOCAODOANHSO_MaBaoCaoDoanhSo_fkey FOREIGN KEY (MaBaoCaoDoanhSo) REFERENCES public.BAOCAODOANHSO(MaBaoCaoDoanhSo)
);
CREATE TABLE public.CHITIET_THUCDONMAU (
  MaThucDon integer NOT NULL,
  MaMonAn integer NOT NULL,
  CONSTRAINT CHITIET_THUCDONMAU_pkey PRIMARY KEY (MaThucDon, MaMonAn),
  CONSTRAINT CHITIET_THUCDONMAU_MaThucDon_fkey FOREIGN KEY (MaThucDon) REFERENCES public.THUCDON_MAU(MaThucDon),
  CONSTRAINT CHITIET_THUCDONMAU_MaMonAn_fkey FOREIGN KEY (MaMonAn) REFERENCES public.MONAN(MaMonAn)
);
CREATE TABLE public.CHUCNANG (
  MaChucNang integer NOT NULL DEFAULT nextval('"CHUCNANG_MaChucNang_seq"'::regclass),
  TenChucNang character varying NOT NULL,
  TenManHinh character varying NOT NULL,
  CONSTRAINT CHUCNANG_pkey PRIMARY KEY (MaChucNang)
);
CREATE TABLE public.DATTIEC (
  MaDatTiec integer NOT NULL DEFAULT nextval('"DATTIEC_MaDatTiec_seq"'::regclass),
  TenChuRe character varying NOT NULL,
  TenCoDau character varying NOT NULL,
  DienThoai character varying NOT NULL,
  NgayDatTiec date,
  NgayDaiTiec date NOT NULL,
  MaCa integer NOT NULL,
  MaSanh integer NOT NULL,
  MaThucDon integer NOT NULL,
  TienDatCoc numeric NOT NULL CHECK ("TienDatCoc" >= 0::numeric),
  SoLuongBan integer NOT NULL CHECK ("SoLuongBan" >= 0),
  SoBanDuTru integer NOT NULL CHECK ("SoBanDuTru" >= 0),
  DaHuy boolean NOT NULL DEFAULT false,
  CONSTRAINT DATTIEC_pkey PRIMARY KEY (MaDatTiec),
  CONSTRAINT DATTIEC_MaCa_fkey FOREIGN KEY (MaCa) REFERENCES public.CA(MaCa),
  CONSTRAINT DATTIEC_MaSanh_fkey FOREIGN KEY (MaSanh) REFERENCES public.SANH(MaSanh),
  CONSTRAINT DATTIEC_MaThucDon_fkey FOREIGN KEY (MaThucDon) REFERENCES public.THUCDON(MaThucDon)
);
CREATE TABLE public.DATTIEC_DICHVU (
  MaDatTiec integer NOT NULL,
  MaDichVu integer NOT NULL,
  SoLuong integer NOT NULL CHECK ("SoLuong" >= 0),
  DonGiaThoiDiemDat numeric NOT NULL CHECK ("DonGiaThoiDiemDat" >= 0::numeric),
  ThanhTien numeric NOT NULL CHECK ("ThanhTien" >= 0::numeric),
  CONSTRAINT DATTIEC_DICHVU_pkey PRIMARY KEY (MaDatTiec, MaDichVu),
  CONSTRAINT DATTIEC_DICHVU_MaDatTiec_fkey FOREIGN KEY (MaDatTiec) REFERENCES public.DATTIEC(MaDatTiec),
  CONSTRAINT DATTIEC_DICHVU_MaDichVu_fkey FOREIGN KEY (MaDichVu) REFERENCES public.DICHVU(MaDichVu)
);
CREATE TABLE public.DICHVU (
  MaDichVu integer NOT NULL DEFAULT nextval('"DICHVU_MaDichVu_seq"'::regclass),
  TenDichVu character varying NOT NULL,
  MaLoaiDichVu integer NOT NULL,
  DonGia numeric NOT NULL CHECK ("DonGia" >= 0::numeric),
  GhiChu text,
  AnhURL text,
  DaXoa boolean NOT NULL DEFAULT false,
  CONSTRAINT DICHVU_pkey PRIMARY KEY (MaDichVu),
  CONSTRAINT DICHVU_MaLoaiDichVu_fkey FOREIGN KEY (MaLoaiDichVu) REFERENCES public.LOAIDICHVU(MaLoaiDichVu)
);
CREATE TABLE public.HOADON (
  MaHoaDon integer NOT NULL DEFAULT nextval('"HOADON_MaHoaDon_seq"'::regclass),
  MaDatTiec integer NOT NULL,
  NgayThanhToan date NOT NULL,
  NgayLapHoaDon date NOT NULL,
  TongTienBan numeric NOT NULL CHECK ("TongTienBan" >= 0::numeric),
  TongTienDichVu numeric NOT NULL CHECK ("TongTienDichVu" >= 0::numeric),
  TongTienHoaDon numeric NOT NULL CHECK ("TongTienHoaDon" >= 0::numeric),
  ApDungQuyDinhPhat boolean NOT NULL DEFAULT false,
  PhanTramPhatMotNgay numeric NOT NULL DEFAULT 0.0 CHECK ("PhanTramPhatMotNgay" >= 0::numeric AND "PhanTramPhatMotNgay" <= 100::numeric),
  TongTienPhat numeric NOT NULL CHECK ("TongTienPhat" >= 0::numeric),
  TongTienConLai numeric NOT NULL,
  TrangThai integer NOT NULL,
  CONSTRAINT HOADON_pkey PRIMARY KEY (MaHoaDon),
  CONSTRAINT HOADON_MaDatTiec_fkey FOREIGN KEY (MaDatTiec) REFERENCES public.DATTIEC(MaDatTiec)
);
CREATE TABLE public.LOAIDICHVU (
  MaLoaiDichVu integer NOT NULL DEFAULT nextval('"LOAIDICHVU_MaLoaiDichVu_seq"'::regclass),
  TenLoaiDichVu character varying NOT NULL,
  DaXoa boolean NOT NULL DEFAULT false,
  CONSTRAINT LOAIDICHVU_pkey PRIMARY KEY (MaLoaiDichVu)
);
CREATE TABLE public.LOAIMONAN (
  MaLoaiMonAn integer NOT NULL DEFAULT nextval('"LOAIMONAN_MaLoaiMonAn_seq"'::regclass),
  TenLoaiMonAn character varying NOT NULL,
  DaXoa boolean NOT NULL DEFAULT false,
  CONSTRAINT LOAIMONAN_pkey PRIMARY KEY (MaLoaiMonAn)
);
CREATE TABLE public.LOAISANH (
  MaLoaiSanh integer NOT NULL DEFAULT nextval('"LOAISANH_MaLoaiSanh_seq"'::regclass),
  TenLoaiSanh character varying NOT NULL,
  DonGiaBanToiThieu numeric NOT NULL CHECK ("DonGiaBanToiThieu" >= 0::numeric),
  DaXoa boolean NOT NULL DEFAULT false,
  CONSTRAINT LOAISANH_pkey PRIMARY KEY (MaLoaiSanh)
);
CREATE TABLE public.MONAN (
  MaMonAn integer NOT NULL DEFAULT nextval('"MONAN_MaMonAn_seq"'::regclass),
  TenMonAn character varying NOT NULL,
  MaLoaiMonAn integer NOT NULL,
  DonGia numeric NOT NULL CHECK ("DonGia" >= 0::numeric),
  GhiChu text,
  AnhURL text,
  DaXoa boolean NOT NULL DEFAULT false,
  CONSTRAINT MONAN_pkey PRIMARY KEY (MaMonAn),
  CONSTRAINT MONAN_MaLoaiMonAn_fkey FOREIGN KEY (MaLoaiMonAn) REFERENCES public.LOAIMONAN(MaLoaiMonAn)
);
CREATE TABLE public.NGUOIDUNG (
  MaNguoiDung integer NOT NULL DEFAULT nextval('"NGUOIDUNG_MaNguoiDung_seq"'::regclass),
  TenDangNhap character varying NOT NULL UNIQUE,
  MatKhau character varying NOT NULL,
  TenNguoiDung character varying NOT NULL,
  MaNhom integer NOT NULL,
  CONSTRAINT NGUOIDUNG_pkey PRIMARY KEY (MaNguoiDung),
  CONSTRAINT NGUOIDUNG_MaNhom_fkey FOREIGN KEY (MaNhom) REFERENCES public.NHOMNGUOIDUNG(MaNhom)
);
CREATE TABLE public.NHOMNGUOIDUNG (
  MaNhom integer NOT NULL DEFAULT nextval('"NHOMNGUOIDUNG_MaNhom_seq"'::regclass),
  TenNhom character varying NOT NULL,
  CONSTRAINT NHOMNGUOIDUNG_pkey PRIMARY KEY (MaNhom)
);
CREATE TABLE public.PHANQUYEN (
  MaNhom integer NOT NULL,
  MaChucNang integer NOT NULL,
  CONSTRAINT PHANQUYEN_pkey PRIMARY KEY (MaNhom, MaChucNang),
  CONSTRAINT PHANQUYEN_MaNhom_fkey FOREIGN KEY (MaNhom) REFERENCES public.NHOMNGUOIDUNG(MaNhom),
  CONSTRAINT PHANQUYEN_MaChucNang_fkey FOREIGN KEY (MaChucNang) REFERENCES public.CHUCNANG(MaChucNang)
);
CREATE TABLE public.REFRESH_TOKEN (
  MaRefreshToken integer NOT NULL DEFAULT nextval('"REFRESH_TOKEN_MaRefreshToken_seq"'::regclass),
  MaNguoiDung integer NOT NULL,
  RefreshToken character varying NOT NULL,
  HanSuDung timestamp without time zone NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT REFRESH_TOKEN_pkey PRIMARY KEY (MaRefreshToken),
  CONSTRAINT REFRESH_TOKEN_MaNguoiDung_fkey FOREIGN KEY (MaNguoiDung) REFERENCES public.NGUOIDUNG(MaNguoiDung)
);
CREATE TABLE public.SANH (
  MaSanh integer NOT NULL DEFAULT nextval('"SANH_MaSanh_seq"'::regclass),
  TenSanh character varying NOT NULL,
  MaLoaiSanh integer NOT NULL,
  SoLuongBanToiDa integer NOT NULL CHECK ("SoLuongBanToiDa" >= 0),
  GhiChu text,
  AnhURL text,
  DaXoa boolean NOT NULL DEFAULT false,
  CONSTRAINT SANH_pkey PRIMARY KEY (MaSanh),
  CONSTRAINT SANH_MaLoaiSanh_fkey FOREIGN KEY (MaLoaiSanh) REFERENCES public.LOAISANH(MaLoaiSanh)
);
CREATE TABLE public.THAMSO (
  PhanTramPhatTrenNgay numeric NOT NULL CHECK ("PhanTramPhatTrenNgay" >= 0::numeric AND "PhanTramPhatTrenNgay" <= 100::numeric)
);
CREATE TABLE public.THUCDON (
  MaThucDon integer NOT NULL DEFAULT nextval('"THUCDON_MaThucDon_seq"'::regclass),
  TenThucDon character varying NOT NULL,
  TongDonGiaThoiDiemDat numeric NOT NULL CHECK ("TongDonGiaThoiDiemDat" >= 0::numeric),
  GhiChu text,
  DaXoa boolean NOT NULL DEFAULT false,
  CONSTRAINT THUCDON_pkey PRIMARY KEY (MaThucDon)
);
CREATE TABLE public.THUCDON_MAU (
  MaThucDon integer NOT NULL,
  TenThucDon character varying,
  DonGiaHienTai numeric,
  GhiChu text,
  DaXoa boolean,
  CONSTRAINT THUCDON_MAU_pkey PRIMARY KEY (MaThucDon)
);
CREATE TABLE public.THUCDON_MONAN (
  MaThucDon integer NOT NULL,
  MaMonAn integer NOT NULL,
  DonGiaThoiDiemDat numeric NOT NULL CHECK ("DonGiaThoiDiemDat" >= 0::numeric),
  CONSTRAINT THUCDON_MONAN_pkey PRIMARY KEY (MaThucDon, MaMonAn),
  CONSTRAINT THUCDON_MONAN_MaThucDon_fkey FOREIGN KEY (MaThucDon) REFERENCES public.THUCDON(MaThucDon),
  CONSTRAINT THUCDON_MONAN_MaMonAn_fkey FOREIGN KEY (MaMonAn) REFERENCES public.MONAN(MaMonAn)
);