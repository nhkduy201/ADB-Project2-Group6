alter proc ThemHoaDon
@nl datetime, @dtl int, @tlgg float, @httt nvarchar(20), @mkh int, @mnv int, @tt int, @last int out
as
begin
	select @last = (select top 1 MaHoaDon from HOADON order by MaHoaDon desc) + 1;
	select @last = isnull(@last, 1);
	insert into HOADON(MaHoaDon, NgayLapHoaDon, DiemTichLuyHoaDon, TyLeGiamGia, LoaiHoaDon, HinhThucThanhToan, MaKhachHang, MaNhanVien, TongTien)
	values (@last, @nl, @dtl, @tlgg, 1, @httt, @mkh, @mnv, @tt);
end