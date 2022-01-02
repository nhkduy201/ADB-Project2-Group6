use QLConCung
go

--Phân hệ NHÂN SỰ:
--Truy vấn 2:
CREATE NONCLUSTERED INDEX MaNhanVien_idx ON CHAMCONG(MaNhanVien)
--Truy vấn 4:
CREATE NONCLUSTERED INDEX MaNhanVien_idx ON HOADON (MaNhanVien)


--Phân hệ KHÁCH HÀNG:
--Truy vấn 2:
CREATE NONCLUSTERED INDEX TenSanPham_idx ON SANPHAM (TenSanPham)
--Truy vấn 3:
CREATE NONCLUSTERED INDEX MaLoai_MaNhaCungCap_idx ON SANPHAM (MaLoai,MaNhaCungCap)

--Phân hệ QUẢN LÝ:
--Truy vấn 2:
create nonclustered index MaNhanVien_idx on HOADON(MaNhanVien)
