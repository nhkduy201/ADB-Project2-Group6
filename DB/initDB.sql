
create database QLConCung
go

use QLConCung
go

--Tạo bảng
create table KHACHHANG
(
	MaKhachHang int,
	HoTenKhachHang nvarchar(30),
	SoDienThoaiKhachHang char(10),
	NgaySinhKhachHang datetime,
	DiaChiKhachHang nvarchar(50),
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
	BinhLuan nvarchar(100),
	ThoiDiemBinhLuan datetime,
	constraint PK_DG primary key(MaKhachHang,MaSanPham)
)

create table NHANVIEN
(
	MaNhanVien int,
	TenNhanVien nvarchar(30),
	SoDienThoaiNhanVien char(10),
	CMND char(9),
	LoaiNhanVien nvarchar(9) , --(Bán hàng,Tư vấn,Quản lý,Giao hàng)
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
	NgayLamViec datetime,
	constraint PK_CC primary key(MaNhanVien,NgayLamViec)
)

create table HOADON
(
	MaHoaDon int,
	NgayLapHoaDon datetime,
	DiemTichLuyHoaDon int,
	TyLeGiamGia float,
	LoaiHoaDon int,
	HinhThucThanhToan nvarchar(8), --(Tiền mặt,Online)
	MaKhachHang int,
	MaNhanVien int,
	constraint PK_HD primary key(MaHoaDon)
)

create table PHIEUDOIHANG
(
	MaPhieuDoiHang int,
	NgayDoiHang datetime,
	MaKhachHang int,
	constraint PK_PDH primary key(MaPhieuDoiHang)
)

create table CT_DOIHANG
(
	MaPhieuDoiHang int,
	MaSanPham int,
	SoLuongDoiHang int,
	DonGiaDoiHang float,
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
	NgayNhapHang datetime,
	MaNhanVien int,
	constraint PK_PNH primary key(MaPhieuNhapHang)
)

create table CT_NHAPHANG
(
	MaPhieuNhapHang int,
	MaSanPham int,
	SoLuongNhap int,
	DonGiaNhap float,
	constraint PK_CTNH primary key(MaPhieuNhapHang,MaSanPham)
)

create table PHIEUXUATHANG
(
	MaPhieuXuatHang int,
	NgayXuatHang datetime,
	MaNhanVien int,
	constraint PK_PXH primary key(MaPhieuXuatHang)
)

create table CT_XUATHANG
(
	MaPhieuXuatHang int,
	MaSanPham int,
	SoLuongXuat int,
	DonGiaXuat float,
	constraint PK_CTXH primary key(MaPhieuXuatHang,MaSanPham)
)

--Tạo khóa ngoại
alter table UUDAI
add constraint FK_UD_KH
foreign key(MaKhachHang)
references KHACHHANG(MaKhachHang)

alter table UUDAI
add constraint FK_UD_TAKH
foreign key(NamTriAn,HinhThucTriAn)
references TRIANKHACHHANG(NamTriAn,HinhThucTriAn)

alter table DANHGIA
add constraint FK_DG_KH
foreign key(MaKhachHang)
references KHACHHANG(MaKhachHang)

--alter table DANHGIA
--add constraint FK_DG_SPOL
--foreign key(MaSanPham)
--references SANPHAMONLINE(MaSanPham)

alter table LICHSULUONG
add constraint FK_LSL_NV
foreign key(MaNhanVien)
references NhanVien(MaNhanVien)

alter table CHAMCONG
add constraint FK_CC_NV
foreign key(MaNhanVien)
references NhanVien(MaNhanVien)

alter table HOADON
add constraint FK_HD_KH
foreign key(MaKhachHang)
references KHACHHANG(MaKhachHang)

alter table HOADON
add constraint FK_HD_NV
foreign key(MaNhanVien)
references NhanVien(MaNhanVien)

alter table PHIEUDOIHANG
add constraint FK_PDH_KH
foreign key(MaKhachHang)
references KHACHHANG(MaKhachHang)

alter table CT_DOIHANG
add constraint FK_CTDT_PDH
foreign key(MaPhieuDoiHang)
references PHIEUDOIHANG(MaPhieuDoiHang)

--alter table CT_DOIHANG
--add constraint FK_CTDT_SP
--foreign key(MaSanPham)
--references SANPHAM(MaSanPham)

alter table CT_NHANHANG
add constraint FK_CTNH_PDH
foreign key(MaPhieuDoiHang)
references PHIEUDOIHANG(MaPhieuDoiHang)

--alter table CT_NHANHANG
--add constraint FK_CTNH_SP
--foreign key(MaSanPham)
--references SANPHAM(MaSanPham)

alter table PHIEUNHAPHANG
add constraint FK_PNH_NV
foreign key(MaNhanVien)
references NhanVien(MaNhanVien)

alter table CT_NHAPHANG
add constraint FK_CTNH_PNH
foreign key(MaPhieuNhapHang)
references PHIEUNHAPHANG(MaPhieuNhapHang)

--alter table CT_NHAPHANG
--add constraint FK_CTNH_SP
--foreign key(MaSanPham)
--references SANPHAM(MaSanPham)

alter table PHIEUXUATHANG
add constraint FK_PXH_NV
foreign key(MaNhanVien)
references NhanVien(MaNhanVien)

alter table CT_XUATHANG
add constraint FK_CTXH_PNH
foreign key(MaPhieuXuatHang)
references PHIEUXUATHANG(MaPhieuXuatHang)

--alter table CT_XUATHANG
--add constraint FK_CTXH_SP
--foreign key(MaSanPham)
--references SANPHAM(MaSanPham)
