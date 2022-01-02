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