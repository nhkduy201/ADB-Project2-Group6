CREATE DATABASE QLConCung

USE QLConCung
go

--Tạo bảng
create table KHACHHANG
(
	MaKhachHang int,
	HoTenKhachHang nvarchar(50),
	SoDienThoaiKhachHang char(10),
	NgaySinhKhachHang date,
	DiaChiKhachHang nvarchar(100),
	DiemTichLuyKhachHang int,
	constraint PK_KH primary key(MaKhachHang)
)

create table TRIANKHACHHANG
(
	NamTriAn int,
	HinhThucTriAn nvarchar(20), --rút thăm may mắn,phiếu giảm giá ,..
	constraint PK_TAKH primary key(NamTriAn,HinhThucTriAn)
)

create table UUDAI
(
	MaKhachHang int,
	NamTriAn int,
	HinhThucTriAn nvarchar(20),
	constraint PK_UD primary key(MaKhachHang,NamTriAn,HinhThucTriAn)
)

create table DANHGIA
(
	MaKhachHang int,
	MaSanPham int,
	ThoiDiemBinhLuan datetime,
	BinhLuan nvarchar(200),
	constraint PK_DG primary key(MaKhachHang,MaSanPham,ThoiDiemBinhLuan)
)

create table NHANVIEN
(
	MaNhanVien int,
	TenNhanVien nvarchar(50),
	SoDienThoaiNhanVien char(10),
	CMND varchar(13),
	LoaiNhanVien nvarchar(15) , --(Bán hàng,Tư vấn,Quản lý,Giao hàng)
	HieuSuatLamViec float,
	constraint PK_NV primary key(MaNhanVien)
)

create table LICHSULUONG
(
	MaNhanVien int,
	ThoiDiemThayDoiLuong datetime,
	LuongTaiThoiDiem int,
	constraint PK_LSL primary key(MaNhanVien,ThoiDiemThayDoiLuong)
)

create table CHAMCONG
(
	MaNhanVien int,
	NgayLamViec date,
	constraint PK_CC primary key(MaNhanVien,NgayLamViec)
)

create table HOADON
(
	MaHoaDon int,
	NgayLapHoaDon datetime,
	DiemTichLuyHoaDon int,
	TyLeGiamGia float,
	LoaiHoaDon bit,
	HinhThucThanhToan nvarchar(20), --(Tiền mặt,Online)
	MaKhachHang int,
	MaNhanVien int,
	constraint PK_HD primary key(MaHoaDon)
)

create table PHIEUDOIHANG
(
	MaPhieuDoiHang int,
	NgayDoiHang date,
	MaKhachHang int,
	MaNhanVien int,
	constraint PK_PDH primary key(MaPhieuDoiHang)
)

create table CT_DOIHANG
(
	MaPhieuDoiHang int,
	MaSanPham int,
	SoLuongDoiHang int,
	DonGiaDoiHang int,
	constraint PK_CTDH primary key(MaPhieuDoiHang,MaSanPham)
)

create table CT_NHANHANG
(
	MaPhieuDoiHang int,
	MaSanPham int,
	SoLuongNhanHang int,
	DonGiaNhanHang float,
	constraint PK_CT_NH primary key(MaPhieuDoiHang,MaSanPham)
)

create table PHIEUNHAPHANG
(
	MaPhieuNhapHang int,
	NgayNhapHang date,
	MaNhanVien int,
	constraint PK_PNH primary key(MaPhieuNhapHang)
)

create table CT_NHAPHANG
(
	MaPhieuNhapHang int,
	MaSanPham int,
	SoLuongNhap int,
	DonGiaNhap int,
	constraint PK_CTNH primary key(MaPhieuNhapHang,MaSanPham)
)

create table PHIEUXUATHANG
(
	MaPhieuXuatHang int,
	NgayXuatHang date,
	MaNhanVien int,
	constraint PK_PXH primary key(MaPhieuXuatHang)
)

create table CT_XUATHANG
(
	MaPhieuXuatHang int,
	MaSanPham int,
	SoLuongXuat int,
	DonGiaXuat int,
	constraint PK_CTXH primary key(MaPhieuXuatHang,MaSanPham)
)

create table SANPHAM
(
	MaSanPham int,
	MaLoai int,
	MaNhaCungCap int,
	TenSanPham nvarchar(50),
	SoLuongTon int,
	QuocGiaSanXuat nvarchar(30),
	KichThuoc int,
	DonViDoLuong nvarchar(10),
	MoTaChiTiet text,
	LoaiSanPham int,
	constraint PK_SP primary key(MaSanPham)
)

create table LOAISANPHAM
(
	MaLoai int,
	MaLoaiCapCha int,
	TenLoai nvarchar(30),
	constraint PK_LoaiSP primary key(MaLoai)
)

create table NHACUNGCAP
(
	MaNhaCungCap int,
	TenNhaCungCap nvarchar(30),
	QuocGiaCungCap nvarchar(30),
	constraint PK_NhaCC primary key(MaNhaCungCap)
)

create table LICHSUGIA
(
	MaSanPham int,
	ThoiDiemThayDoiGia datetime,
	GiaTaiThoiDiem int,
	constraint PK_LichSuGia primary key(MaSanPham,ThoiDiemThayDoiGia)
)

create table SANPHAMONLINE
(
	MaSanPham int,
	HinhThucKhuyenMai nvarchar(20),
	SoLuongHangConLai int,
	PhanTramGiamGia float,
	ThoiGianKetThuc datetime,
	SoLuotThich int,
	constraint PK_SP_Online primary key(MaSanPham)
)

create table CT_HOADON
(
	MaHoaDon int,
	MaSanPham int,
	SoLuongSanPham int,
	DonGiaSanPham int,
	constraint PK_CT_HoaDon primary key(MaHoaDon,MaSanPham)
)

create table GIOHANG
(
	MaKhachHang int,
	MaSanPham int,
	ThoiGianThemVao datetime,
	SoLuongTrongGio int,
	DonGiaTrongGio int,
	TinhTrang bit,
	constraint PK_GioHang primary key(MaKhachHang,MaSanPham,ThoiGianThemVao)
)

create table GIAOHANG
(
	MaGiaoHang int,
	MaHoaDon int,
	MaNhanVien int,
	DiaChiGiaoHang nvarchar(100),
	TenNguoiNhan nvarchar(30),
	SoDienThoaiNguoiNhan char(10),
	NgayNhanHang date,
	NgayXacNhanDatHang date,
	constraint PK_GiaoHang primary key(MaGiaoHang)
)

CREATE table TAIKHOANDANGNHAP
(
	TenDangNhap varchar(30),
	MaKhachHang int,
	MaNhanVien int,
	MatKhau varchar(50),
	HinhThucDangKy nvarchar(20),
	LoaiTaiKhoan bit,
	constraint PK_TKDN primary key(TenDangNhap)
)


--Tạo khóa ngoại
alter table dbo.LOAISANPHAM
add constraint FK_LSP_LSP
foreign key(MaLoaiCapCha)
references dbo.LOAISANPHAM(MaLoai)

alter table dbo.SANPHAM
add constraint FK_SP_LSP
foreign key(MaLoai)
references dbo.LOAISANPHAM(MaLoai)

alter table dbo.SANPHAM
add constraint FK_SP_NCC
foreign key(MaNhaCungCap)
references dbo.NHACUNGCAP(MaNhaCungCap)

alter table dbo.LICHSUGIA
add constraint FK_LSG_SP
foreign key(MaSanPham)
references dbo.SANPHAM(MaSanPham)

alter table dbo.SANPHAMONLINE
add constraint FK_SPO_SP
foreign key(MaSanPham)
references dbo.SANPHAM(MaSanPham)

alter table dbo.CT_HOADON
add constraint FK_CTHD_SP
foreign key(MaSanPham)
references dbo.SANPHAM(MaSanPham)

alter table dbo.CT_DOIHANG
add constraint FK_CTDH_SP
foreign key(MaSanPham)
references dbo.SANPHAM(MaSanPham)

alter table dbo.CT_NHANHANG
add constraint FK_CTNH_SP
foreign key(MaSanPham)
references dbo.SANPHAM(MaSanPham)

alter table dbo.CT_XUATHANG
add constraint FK_CTXH_SP
foreign key(MaSanPham)
references dbo.SANPHAM(MaSanPham)

alter table dbo.CT_NHAPHANG
add constraint FK_CTNH1_SP
foreign key(MaSanPham)
references dbo.SANPHAM(MaSanPham)

alter table dbo.DANHGIA
add constraint FK_DG_SPO
foreign key(MaSanPham)
references dbo.SANPHAMONLINE(MaSanPham)

alter table dbo.GIOHANG
add constraint FK_GH_SPO
foreign key(MaSanPham)
references dbo.SANPHAMONLINE(MaSanPham)

alter table dbo.CT_HOADON
add constraint FK_CTHD_HD
foreign key(MaHoaDon)
references dbo.HOADON(MaHoaDon)

alter table dbo.GIAOHANG
add constraint FK_GH_HD
foreign key(MaHoaDon)
references dbo.HOADON(MaHoaDon)

alter table dbo.HOADON
add constraint FK_HD_KH
foreign key(MaKhachHang)
references dbo.KHACHHANG(MaKhachHang)

alter table dbo.HOADON
add constraint FK_HD_NV
foreign key(MaNhanVien)
references dbo.NHANVIEN(MaNhanVien)

alter table dbo.GIAOHANG
add constraint FK_GH_NV
foreign key(MaNhanVien)
references dbo.NHANVIEN(MaNhanVien)

alter table dbo.GIOHANG
add constraint FK_GH_KH
foreign key(MaKhachHang)
references dbo.KHACHHANG(MaKhachHang)

alter table dbo.DANHGIA
add constraint FK_DG_KH
foreign key(MaKhachHang)
references dbo.KHACHHANG(MaKhachHang)

alter table dbo.UUDAI
add constraint FK_UD_KH
foreign key(MaKhachHang)
references dbo.KHACHHANG(MaKhachHang)

alter table dbo.UUDAI
add constraint FK_UD_TAKH
foreign key(NamTriAn, HinhThucTriAn)
references dbo.TRIANKHACHHANG(NamTriAn, HinhThucTriAn)

alter table dbo.TAIKHOANDANGNHAP
add constraint FK_TKDN_KH
foreign key(MaKhachHang)
references dbo.KHACHHANG(MaKhachHang)

alter table dbo.TAIKHOANDANGNHAP
add constraint FK_TKDN_NV
foreign key(MaNhanVien)
references dbo.NHANVIEN(MaNhanVien)

alter table dbo.CT_DOIHANG
add constraint FK_CTDH_PDH
foreign key(MaPhieuDoiHang)
references dbo.PHIEUDOIHANG(MaPhieuDoiHang)

alter table dbo.CT_NHANHANG
add constraint FK_CTNH_PDH
foreign key(MaPhieuDoiHang)
references dbo.PHIEUDOIHANG(MaPhieuDoiHang)

alter table dbo.LICHSULUONG
add constraint FK_LSL_NV
foreign key(MaNhanVien)
references dbo.NHANVIEN(MaNhanVien)

alter table dbo.CHAMCONG
add constraint FK_CC_NV
foreign key(MaNhanVien)
references dbo.NHANVIEN(MaNhanVien)

alter table dbo.PHIEUNHAPHANG
add constraint FK_PNH_NV
foreign key(MaNhanVien)
references dbo.NHANVIEN(MaNhanVien)

alter table dbo.PHIEUXUATHANG
add constraint FK_PXH_NV
foreign key(MaNhanVien)
references dbo.NHANVIEN(MaNhanVien)

alter table dbo.CT_NHAPHANG
add constraint FK_CTNH_PNH
foreign key(MaPhieuNhapHang)
references dbo.PHIEUNHAPHANG(MaPhieuNhapHang)

alter table dbo.CT_XUATHANG
add constraint FK_CTXH_PXH
foreign key(MaPhieuXuatHang)
references dbo.PHIEUXUATHANG(MaPhieuXuatHang)