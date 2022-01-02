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
  async getSalaryHistory(userID, limit, offset) {
    await sql.connect(sqlConfig);
    return await sql.query`select ls.ThoiDiemThayDoiLuong, ls.LuongTaiThoiDiem from LICHSULUONG ls where ls.MaNhanVien = ${userID} order by ls.ThoiDiemThayDoiLuong  ASC offset ${offset} rows fetch next ${limit} rows only`;
  }
};
