import sql from "mssql";
import dotenv from "dotenv";
import ProductModels from "./product.models.js";
import moment from "moment";

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
    const pool = await sql.connect(sqlConfig);
    const obj = await this.getAllItemInCart(userID);
    const cartItems = obj.recordset.map((x) => {
      x.ThanhTien = x.DonGiaTrongGio * x.SoLuongTrongGio;
      return x;
    });
    const total = cartItems.reduce((acc, x) => {
      return acc + x.ThanhTien;
    }, 0);
    const themCTStr = cartItems.reduce((acc, x) => {
      return (
        acc +
        `insert into CT_HOADON values (@nextID, ${x.MaSanPham}, ${x.SoLuongTrongGio}, ${x.DonGiaTrongGio})\n`
      );
    }, "");
    const checkOutQuery =
      `update GIOHANG set TinhTrang = 0 where MaKhachHang = ${userID}
declare @nextID int;
exec ThemHoaDon '${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}', ${parseInt(
        Math.random() * 100
      )}, ${
        parseInt(Math.random() * 10) / 10
      }, N'Trực tuyến', ${userID}, ${parseInt(
        Math.random() * 50000
      )}, ${total}, @last = @nextID out
select @nextID as nextID\n` + themCTStr;
    console.log(checkOutQuery);
    const transaction = new sql.Transaction(pool);
    transaction.begin((err) => {
      if (err) {
        console.log("err 1", err);
      }
      const request = new sql.Request(transaction);
      request.query(checkOutQuery, (err, result) => {
        if (err) {
          console.log("err 2", err);
        }
        transaction.commit((err) => {
          if (err) {
            console.log("err 3", err);
          }
          //console.log("Transaction committed.");
        });
      });
    });
  },
};
