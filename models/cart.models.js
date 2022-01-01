import sql from "mssql";
import dotenv from "dotenv";
import ProductModels from "./product.models.js";

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
  async getAllItemInCart(userID) {
    await sql.connect(sqlConfig);
    const obj =
      await sql.query`select GH.MaSanPham, SP.TenSanPham, GH.DonGiaTrongGio, GH.SoLuongTrongGio from GIOHANG GH join SANPHAM SP on GH.MaSanPham = SP.MaSanPham where GH.MaKhachHang = ${userID} and GH.TinhTrang = 1`;
    return obj;
  },
  async addItemToCart(proID, userID, quantity) {
    const obj = await ProductModels.findOnlineProductById(proID);
    const product = obj.recordset[0];
    const price = parseInt(product.GiaHienTai * (1 - product.PhanTramGiamGia));
    const pool = await sql.connect(sqlConfig);
    await pool
      .request()
      .input("addingTime", sql.DateTime, new Date())
      .query(
        `exec ThemHangVaoGio ${userID}, ${proID},  @addingTime, ${quantity}, ${price}`
      );
  },

  async del(proID, userID) {
    await sql.connect(sqlConfig);
    await sql.query`delete from GIOHANG where MaKhachHang = ${userID} and MaSanPham = ${proID}`;
  },

  async checkout(userID) {
    await sql.connect(sqlConfig);
    await sql.query`update GIOHANG set TinhTrang = 0 where MaKhachHang = ${userID}`;
  },
};
