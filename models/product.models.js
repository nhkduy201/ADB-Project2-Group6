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
    async getAllParentsProductType(){
        await sql.connect(sqlConfig);
        const obj = await sql.query`select * from LOAISANPHAM where MaLoaiCapCha is null`;
        return obj;
    },

    async findProductByTypeId(id, limit, offset){
        await sql.connect(sqlConfig);
        const obj = await sql.query`select * from SANPHAM where MaLoai = ${id} order by MaSanPham ASC offset ${offset} rows fetch next ${limit} rows only`;
        return obj;
    },

    async findAllProducts(limit, offset){
        await sql.connect(sqlConfig);
        const obj = await sql.query`select * from SANPHAM order by MaSanPham ASC offset ${offset} rows fetch next ${limit} rows only`;
        return obj;
    },

    async findSubType(parentType){
        await sql.connect(sqlConfig);
        const obj = await sql.query`select * from LOAISANPHAM where MaLoaiCapCha = ${parentType}`;
        return obj;
    },
};