use QLConCung
go


--Phân hệ NHÂN SỰ:
--Truy vấn 2:Thống kê điểm danh của một nhân viên trong một tháng 
--Cụ thể ở đây là thống kê điểm danh của nhân viên có MaNhanVien = 1 trong tháng 12/2021
select nv.MaNhanVien , nv.TenNhanVien ,count(*) as SoNgayLamViec
from NHANVIEN nv join CHAMCONG cc on nv.MaNhanVien = cc.MaNhanVien
where nv.MaNhanVien = 1 and month(cc.NgayLamViec) =12 and year(cc.NgayLamViec) =2021
group by nv.MaNhanVien , nv.TenNhanVien

--Truy vấn 3:Thống kê số đơn hàng của một ngày
--Cụ thể ở đây là thống kê số đơn hàng ngày 19/7/2021
select count(*) as SoDonHang
from HOADON hd
where datediff(day ,hd.NgayLapHoaDon,'2021-07-19') = 0

--Truy vấn 4:Theo dõi doanh số nhân viên bán hàng
--Cụ thể ở đây là doanh số của nhân viên có MaNhanVien =2917
select nv.MaNhanVien , nv.TenNhanVien, sum(hd.TongTien) as DoanhSo
from NHANVIEN nv join HOADON hd on nv.MaNhanVien = hd.MaNhanVien
where  hd.MaNhanVien = 2917 
group by nv.MaNhanVien ,nv.TenNhanVien

--Truy vấn 5:Xem lịch sử lương
select*
from LICHSULUONG


--Phân hệ KHÁCH HÀNG:
--Truy vấn 1: Xem các sản phẩm đang giảm giá cao (có phần trăm giảm giá từ 70% trở lên trong thời hạn)
SELECT SP.* 
FROM SANPHAM SP JOIN SANPHAMONLINE SPO ON SP.MaSanPham = SPO.MaSanPham
WHERE SPO.ThoiGianKetThuc < GETDATE() and SPO.PhanTramGiamGia >= 0.7

--Truy vấn 2:Xem các sản phẩm có tên chứa từ khóa nào đó
--Cụ thể ở đây là xem các sản phẩm có tên bắt đầu bằng 'pet'
SELECT * 
FROM SANPHAM SP 
WHERE LOWER(SP.TenSanPham) like N'pet%'

--Truy vấn 3: Xem các sản phẩm thuộc loại nào đó thuộc nhà cung cấp nào đó
--Cụ thể ở đây là xem các sản phẩm thuộc loại 'Giày tập đi' và nhà cung cấp là 'Roscela'
SELECT SP.* 
FROM SANPHAM SP JOIN LOAISANPHAM LSP ON SP.MaLoai = LSP.MaLoai 
				JOIN  NHACUNGCAP NCC ON SP.MaNhaCungCap = NCC.MaNhaCungCap 
WHERE LSP.TenLoai = N'Giày tập đi' AND NCC.TenNhaCungCap = N'Roscela'

--Truy vấn 4:Xem các sản phẩm trong giỏ hàng của mình
--Cụ thể ở đây là khách hàng có MaKhachHang=52 xem các sản phẩm trong giỏ của mình
SELECT * 
FROM SANPHAM SP JOIN GIOHANG GH ON SP.MaSanPham = GH.MaSanPham 
WHERE GH.MaKhachHang = 52 and GH.TinhTrang = 0

--Phân hệ QUẢN TRỊ
--1. Thêm, xóa, sửa sản phẩm
insert into SANPHAM(...) values (....)
delete from SANPHAM where …. (thông thường xóa dựa trên MaSanPham)
update SANPHAM set … where … (thông thường update SoLuongTon dựa trên MaSanPham)

--2. Lưu vết lịch sử giá sản phẩm
select *
from LICHSUGIA join SANPHAM on LICHSUGIA.MaSanPham = SANPHAM.MaSanPham
where SANPHAM.MaSanPham = 1

--3. Theo dõi số lượng hàng tồn kho
select SoLuongTon
from SanPham

--4.1. Theo dõi lịch sử nhập hàng
select * 
from PHIEUNHAPHANG pnh join CT_NHAPHANG ctnh on pxh.MaPhieuNhapHang = ctxh.MaPhieuNhapHang

--4.2. Theo dõi lịch sử xuất hàng
select * 
from PHIEUXUATHANG pxh join CT_XUATHANG ctxh on pxh.MaPhieuXuatHang = ctxh.MaPhieuXuatHang

--Phân hệ QUẢN LÝ
--1. Thống kê doanh thu trong ngày
select SUM(hd.TongTien) as TongDoanhThuNgay
from HOADON hd
where hd.NgayLapHoaDon = '2021-12-31'

--2. Thống kê số lượng hóa đơn do nhân viên (cụ thể) lập
select COUNT(*) as TongSoHD
from HOADON hd
where hd.MaNhanVien = 1053

--3. Thống kê mức tiêu thụ của các sản phẩm
select sp.MaSanPham, sp.TenSanPham, SUM(cthd.SoLuongSanPham) as SL_TieuThu
from (SANPHAM sp join CT_HOADON cthd
on sp.MaSanPham = cthd.MaSanPham) join HOADON hd
on hd.MaHoaDon = cthd.MaHoaDon
where MONTH(hd.NgayLapHoaDon) = 12
and YEAR(hd.NgayLapHoaDon) = 2020
group by sp.MaSanPham, sp.TenSanPham

--4. Thống kê các sản phẩm có số lượng bị đổi/trả vượt qua 6 trong tháng
select sp.MaSanPham, sp.TenSanPham
from (SANPHAM sp join CT_DOIHANG ctdh
on sp.MaSanPham = ctdh.MaSanPham) join PHIEUDOIHANG pdh
on pdh.MaPhieuDoiHang = ctdh.MaPhieuDoiHang
where MONTH(pdh.NgayDoiHang) = 12
and YEAR(pdh.NgayDoiHang) = 2020
and ctdh.SoLuongDoiHang < 6
group by sp.MaSanPham, sp.TenSanPham

--5. Thêm ưu đãi cho khách hàng
insert into UUDAI (MaKhachHang, NamTriAn, HinhThucTriAn) values (50001, 2019, N'Giamgia30')
