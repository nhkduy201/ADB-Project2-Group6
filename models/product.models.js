import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: "localhost",
  options: {
    trustServerCertificate: true,
  },
};

export default {
  async getAllParentsProductType() {
    await sql.connect(sqlConfig);
    const obj =
      await sql.query`select * from LOAISANPHAM where MaLoaiCapCha is null`;
    return obj;
  },

  async findProductByTypeId(id, limit, offset, type = "all") {
    await sql.connect(sqlConfig);
    // all
    var sqlQuery = `select * from SANPHAM where MaLoai = ${id} and TinhTrang = 1 order by MaSanPham ASC offset ${offset} rows fetch next ${limit} rows only`;
    if (type == "on") {
      sqlQuery = `select SP.MaSanPham, SP.TenSanPham, SP.MoTaChiTiet , (SELECT TOP 1 GiaTaiThoiDiem FROM LICHSUGIA LSG WHERE MaSanPham = SPO.MaSanPham ORDER BY ThoiDiemThayDoiGia DESC) as GiaHienTai, SPO.HinhThucKhuyenMai, SPO.PhanTramGiamGia from SANPHAM SP join SANPHAMONLINE SPO on SP.MaSanPham = SPO.MaSanPham where MaLoai = ${id} and TinhTrang = 1 order by SP.MaSanPham ASC offset ${offset} rows fetch next ${limit} rows only`;
    } else if (type == "off") {
    }
    const obj = await sql.query(sqlQuery);
    return obj;
  },

  async findProductById(id) {
    await sql.connect(sqlConfig);
    const obj = await sql.query`select * from SANPHAM where MaSanPham = ${id}`;
    return obj;
  },
  async findOnlineProductById(id) {
    await sql.connect(sqlConfig);
    const obj =
      await sql.query`select SP.*,SPO.MaSanPham MaSPO, SPO.HinhThucKhuyenMai, SPO.SoLuongHangConLai, spo.PhanTramGiamGia, spo.ThoiGianKetThuc, spo.SoLuotThich, (SELECT TOP 1 GiaTaiThoiDiem FROM LICHSUGIA LSG WHERE MaSanPham = SPO.MaSanPham ORDER BY ThoiDiemThayDoiGia DESC) as GiaHienTai, LSP.TenLoai, NCC.TenNhaCungCap, NCC.QuocGiaCungCap from SANPHAM SP join SANPHAMONLINE SPO on SP.MaSanPham = SPO.MaSanPham join LOAISANPHAM LSP on SP.MaLoai = LSP.MaLoai join NHACUNGCAP NCC on SP.MaNhaCungCap = NCC.MaNhaCungCap where SP.MaSanPham = ${id}`;
    return obj;
  },
  async findAllProducts(limit, offset) {
    await sql.connect(sqlConfig);
    const obj =
      await sql.query`select * from SANPHAM where TinhTrang = 1 order by MaSanPham  ASC offset ${offset} rows fetch next ${limit} rows only`;
    return obj;
  },

  async findSubType(parentType) {
    await sql.connect(sqlConfig);
    const obj =
      await sql.query`select * from LOAISANPHAM where MaLoaiCapCha = ${parentType}`;
    return obj;
  },

  async getAllProductType() {
    await sql.connect(sqlConfig);
    const obj = await sql.query`select * from LOAISANPHAM`;
    return obj;
  },

  async getAllSupplier() {
    await sql.connect(sqlConfig);
    const obj = await sql.query`select * from NHACUNGCAP`;
    return obj;
  },

  async getAllProductID() {
    await sql.connect(sqlConfig);
    const obj = await sql.query`select MaSanPham from SANPHAM`;
    return obj;
  },

  async addProduct(id, name, type, supplier, country, size, count, des, price) {
    await sql.connect(sqlConfig);
    const obj =
      await sql.query`insert into SanPham values (${id}, ${type}, ${supplier}, ${name}, 0, ${country}, ${size}, 
                            ${count}, ${des}, 1, 1, ${price})`;
    var d = new Date();
    d.setHours(d.getHours() + 7);
    const obj2 =
      await sql.query`insert into LichSuGia values (${id}, ${d}, ${price})`;
    return obj;
  },

  async delProduct(id) {
    await sql.connect(sqlConfig);
    const obj =
      await sql.query`update SANPHAM set TinhTrang = 0 where MaSanPham = ${id}`;
    return obj;
  },

  async updateProduct(
    id,
    name,
    type,
    supplier,
    country,
    size,
    count,
    des,
    price,
    flag
  ) {
    await sql.connect(sqlConfig);
    if (flag) {
      const obj =
        await sql.query`update SANPHAM set TenSanPham = ${name}, MaLoai = ${type},
                        MaNhaCungCap = ${supplier}, QuocGiaSanXuat = ${country}, KichThuoc = ${size},
                        DonViDoLuong = ${count}, MoTaChiTiet = ${des}, GiaSanPham = ${price} where MaSanPham = ${id}`;
      var d = new Date();
      d.setHours(d.getHours() + 7);
      const obj2 =
        await sql.query`insert into LichSuGia values (${id}, ${d}, ${price})`;
    } else {
      const obj =
        await sql.query`update SANPHAM set TenSanPham = ${name}, MaLoai = ${type},
                        MaNhaCungCap = ${supplier}, QuocGiaSanXuat = ${country}, KichThuoc = ${size},
                        DonViDoLuong = ${count}, MoTaChiTiet = ${des} where MaSanPham = ${id}`;
        }
    },

    async getAllPriceHistory(id, limit){
        await sql.connect(sqlConfig);
        var obj;
        if (limit === 5)
            obj = await sql.query`select * from LICHSUGIA where MaSanPham = ${id} order by ThoiDiemThayDoiGia DESC offset 0 rows fetch next ${limit} rows only`;
        else
            obj = await sql.query`select * from LICHSUGIA where MaSanPham = ${id} order by ThoiDiemThayDoiGia DESC`;
        return obj;
    },

    async getMaxDate(){
        await sql.connect(sqlConfig);
        const obj1 = await sql.query`select max(NgayLapHoaDon) from HoaDon`;
        const obj2 = await sql.query`select max(NgayDoiHang) from PhieuDoiHang`;
        const obj3 = await sql.query`select max(NgayNhapHang) from PhieuNhapHang`;
        const obj4 = await sql.query`select max(NgayXuatHang) from PhieuXuatHang`;
        return [obj1, obj2, obj3, obj4];
    },

    async getAllOutcome(year, month){
        await sql.connect(sqlConfig);
        const obj1 = await sql.query`select sum(cast(TongTien as BIGINT)) as SUM from HoaDon where Year(NgayLapHoaDon) = ${year} and Month(NgayLapHoaDon) = ${month}`;
        const obj2 = await sql.query`select sum(cast(TongTien as BIGINT)) as SUM from PhieuDoiHang where Year(NgayDoiHang) = ${year} and Month(NgayDoiHang) = ${month}`;
        const obj3 = await sql.query`select sum(cast(TongTien as BIGINT)) as SUM from PhieuNhapHang where Year(NgayNhapHang) = ${year} and Month(NgayNhapHang) = ${month}`;
        const obj4 = await sql.query`select sum(cast(TongTien as BIGINT)) as SUM from PhieuXuatHang where Year(NgayXuatHang) = ${year} and Month(NgayXuatHang) = ${month}`;
        return [obj1, obj2, obj3, obj4];
    },

    async getDetailBill(year, month, limit, offset){
        await sql.connect(sqlConfig);
        const obj = await sql.query`select * from HoaDon where Year(NgayLapHoaDon) = ${year} and Month(NgayLapHoaDon) = ${month} order by NgayLapHoaDon DESC offset ${offset} rows fetch next ${limit} rows only`;
        return obj;
    },

    async getDetailExchange(year, month, limit, offset){
        await sql.connect(sqlConfig);
        const obj = await sql.query`select * from PhieuDoiHang where Year(NgayDoiHang) = ${year} and Month(NgayDoiHang) = ${month} order by NgayDoiHang DESC offset ${offset} rows fetch next ${limit} rows only`;
        return obj;
    },

    async getDetailImport(year, month, limit, offset){
        await sql.connect(sqlConfig);
        const obj = await sql.query`select * from PhieuNhapHang where Year(NgayNhapHang) = ${year} and Month(NgayNhapHang) = ${month} order by NgayNhapHang DESC offset ${offset} rows fetch next ${limit} rows only`;
        return obj;
    },

    async getDetailExport(year, month, limit, offset){
        await sql.connect(sqlConfig);
        const obj = await sql.query`select * from PhieuXuatHang where Year(NgayXuatHang) = ${year} and Month(NgayXuatHang) = ${month} order by NgayXuatHang DESC offset ${offset} rows fetch next ${limit} rows only`;
        return obj;
    }
  ,

  async getAllPriceHistory(id, limit) {
    await sql.connect(sqlConfig);
    var obj;
    if (limit === 5)
      obj =
        await sql.query`select * from LICHSUGIA where MaSanPham = ${id} order by ThoiDiemThayDoiGia DESC offset 0 rows fetch next ${limit} rows only`;
    else
      obj =
        await sql.query`select * from LICHSUGIA where MaSanPham = ${id} order by ThoiDiemThayDoiGia DESC`;
    return obj;
  },
};
