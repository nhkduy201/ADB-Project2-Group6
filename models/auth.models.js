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
  async getAllAccount(username, password) {
    await sql.connect(sqlConfig);
    const obj =
      await sql.query`select * from TAIKHOANDANGNHAP where TenDangNhap = ${username} and MatKhau = ${password}`;
    return obj;
  },

  async findByUsername(username) {
    await sql.connect(sqlConfig);
    const obj =
      await sql.query`select * from TAIKHOANDANGNHAP where TenDangNhap = ${username}`;
    return obj;
  },

  async addCustomer(name, phone, dob, address) {
    await sql.connect(sqlConfig);
    const obj = await sql.query`select count(*) from KhachHang`;
    const length = obj.recordset[0][""];
    const ret =
      await sql.query`insert into KhachHang(MaKhachHang, HoTenKhachHang, SoDienThoaiKhachHang, NgaySinhKhachHang, DiaChiKhachHang, DiemTichLuyKhachHang)
                                    values (${
                                      length + 1
                                    }, ${name}, ${phone}, ${dob}, ${address}, 0)`;
    return length + 1;
  },

  async addAccount(username, password, id) {
    await sql.connect(sqlConfig);
    const ret =
      await sql.query`insert into TaiKhoanDangNhap(TenDangNhap, MaKhachHang, MaNhanVien, MatKhau, HinhThucDangKy, LoaiTaiKhoan)
                                    values (${username}, ${id}, null, ${password}, N'Số Điện Thoại', 0)`;
    return ret;
  },

  async findEmployeeById(id) {
    await sql.connect(sqlConfig);
    const obj =
      await sql.query`select * from NhanVien where MaNhanVien = ${id}`;
    return obj;
  },
  auth(req, res, next) {
    if (req.session.auth === false) {
      req.session.retUrl = req.originalUrl;
      return res.redirect("/login");
    }
    next();
  },
  async getUserByID(id) {
    await sql.connect(sqlConfig);
    const obj =
      await sql.query`select KH2.MaKhachHang, KH2.HoTenKhachHang, (select count(*) from KHACHHANG KH1 join GIOHANG GH on KH1.MaKhachHang = GH.MaKhachHang where KH1.MaKhachHang = ${id} and GH.TinhTrang = 1) SoLuongLoaiHangTrongGio from KHACHHANG KH2 where KH2.MaKhachHang = ${id}`;
    return obj;
  },
  async getUserDetailByID(id) {
    await sql.connect(sqlConfig);
    const obj =
      await sql.query`select KH.*, TK.TenDangNhap from KHACHHANG KH join TAIKHOANDANGNHAP TK on KH.MaKhachHang = TK.MaKhachHang where KH.MaKhachHang = ${id}`;
    return obj;
  },
};
