CREATE PROCEDURE sp_UpdatePrice @id int, @price int
AS
	UPDATE dbo.SANPHAM SET GiaSanPham = @price WHERE MaSanPham = @id

DECLARE @i INT
SET @i = 1
WHILE (@i <= 50002)
BEGIN
	DECLARE @price INT
	SET @price = (SELECT TOP 1 GiaTaiThoiDiem FROM dbo.LICHSUGIA WHERE MaSanPham = @i ORDER BY ThoiDiemThayDoiGia DESC)
	EXEC sp_UpdatePrice @i, @price
	SET @i = @i + 1
END