use QLConCung
go

--Tạo bảng
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
	constraint PK_GioHang primary key(MaKhachHang,MaSanPham,ThoiGianThemVao)
)

create table GIAOHANG
(
	MaGiaoHang int,
	MaHoaDon int,
	MaNhanVien int,
	MaKhachHang int,
	DiaChiGiaoHang nvarchar(100),
	TenNguoiNhan nvarchar(30),
	SoDienThoaiNguoiNhan char(10),
	NgayNhanHang date,
	NgayXacNhanDatHang date,
	constraint PK_GiaoHang primary key(MaGiaoHang)
)

create table TAIKHOANDANGNHAP
(
	TenDangNhap varchar(30),
	MaKhachHang int,
	MaNhanVien int,
	MatKhau text,
	HinhThucDangKy nvarchar(20),
	LoaiTaiKhoan int,
	constraint PK_TKDN primary key(TenDangNhap)
)

--Tạo khóa ngoại
alter table DANHGIA
add constraint FK_DG_SPOL
foreign key(MaSanPham)
references SANPHAMONLINE(MaSanPham)

alter table CT_DOIHANG
add constraint FK_CTDT_SP
foreign key(MaSanPham)
references SANPHAM(MaSanPham)

alter table CT_NHANHANG
add constraint FK_CT_NhanHang_SP
foreign key(MaSanPham)
references SANPHAM(MaSanPham)

alter table CT_NHAPHANG
add constraint FK_CT_NhapHang_SP
foreign key(MaSanPham)
references SANPHAM(MaSanPham)

alter table CT_XUATHANG
add constraint FK_CTXH_SP
foreign key(MaSanPham)
references SANPHAM(MaSanPham)

alter table CT_HOADON
add constraint FK_CT_HoaDon_SP
foreign key(MaSanPham)
references SANPHAM(MaSanPham)

alter table CT_HOADON
add constraint FK_CT_HoaDon_HD
foreign key(MaHoaDon)
references HOADON(MaHoaDon)

alter table GIOHANG
add constraint FK_GioHang_KH
foreign key(MaKhachHang)
references KHACHHANG(MaKhachHang)

alter table GIOHANG
add constraint FK_GioHang_SPOL
foreign key(MaSanPham)
references SANPHAM(MaSanPham)

alter table SANPHAM
add constraint FK_SP_NCC
foreign key(MaNhaCungCap)
references NHACUNGCAP(MaNhaCungCap)

alter table SANPHAM
add constraint FK_SP_Loai
foreign key(MaLoai)
references LOAISANPHAM(MaLoai)

alter table LOAISANPHAM
add constraint FK_Loai_LoaiCapCha
foreign key(MaLoaiCapCha)
references LOAISANPHAM(MaLoai)

alter table LICHSUGIA
add constraint FK_LSGia_SP
foreign key(MaSanPham)
references SANPHAM(MaSanPham)

alter table SANPHAMONLINE
add constraint FK_SPOL_SP
foreign key(MaSanPham)
references SANPHAM(MaSanPham)

alter table GIAOHANG
add constraint FK_GiaoHang_HD
foreign key(MaHoaDon)
references HOADON(MaHoaDon)

alter table GIAOHANG
add constraint FK_GiaoHang_NV
foreign key(MaNhanVien)
references NHANVIEN(MaNhanVien)

alter table GIAOHANG
add constraint FK_GiaoHang_KH
foreign key(MaKhachHang)
references KHACHHANG(MaKhachHang)

alter table TAIKHOANDANGNHAP
add constraint FK_TK_NV
foreign key(MaNhanVien)
references NHANVIEN(MaNhanVien)

alter table TAIKHOANDANGNHAP
add constraint FK_TK_KH
foreign key(MaKhachHang)
references KHACHHANG(MaKhachHang)