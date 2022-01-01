create proc ThemHangVaoGio
@userID int, @proID int, @addTime datetime, @quan int, @price int
as 
	begin
		if exists(select * from GIOHANG where MaSanPham = @proID and MaKhachHang = @userID and TinhTrang = 1)
		begin
			declare @curquan int;
			select @curquan = (select SoLuongTrongGio from GIOHANG where MaSanPham = @proID and MaKhachHang = @userID and TinhTrang = 1);
			update GIOHANG
			set ThoiGianThemVao = @addTime, SoLuongTrongGio = @curquan + @quan
			where MaSanPham = @proID and MaKhachHang = @userID and TinhTrang = 1
		end
		else
			insert into GIOHANG values (@userID, @proID, @addTime, @quan, @price, 1)
	end

