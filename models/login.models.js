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
    async getAllAccount(username, password){
        await sql.connect(sqlConfig);
        const obj = await sql.query`select * from TAIKHOANDANGNHAP where TenDangNhap like ${username} and MatKhau like ${password}`;
        return obj;
    }
};