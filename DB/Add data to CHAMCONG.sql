use QLConCung
go

declare @i int = 1
while (@i<=30)
begin
	insert into CHAMCONG
	select MaNhanVien, DATEADD(DAY,-@i,'2021-12-31') from NHANVIEN
	set @i =@i+1
end