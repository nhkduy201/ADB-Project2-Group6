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
        const obj = await sql.query`select * from SANPHAM where MaLoai = ${id} and TinhTrang = 1 order by MaSanPham ASC offset ${offset} rows fetch next ${limit} rows only`;
        return obj;
    },

    async findProductById(id){
        await sql.connect(sqlConfig);
        const obj = await sql.query`select * from SANPHAM where MaSanPham = ${id}`;
        return obj;
    },

    async findAllProducts(limit, offset){
        await sql.connect(sqlConfig);
        const obj = await sql.query`select * from SANPHAM where TinhTrang = 1 order by MaSanPham  ASC offset ${offset} rows fetch next ${limit} rows only`;
        return obj;
    },

    async findSubType(parentType){
        await sql.connect(sqlConfig);
        const obj = await sql.query`select * from LOAISANPHAM where MaLoaiCapCha = ${parentType}`;
        return obj;
    },

    async getAllProductType(){
        await sql.connect(sqlConfig);
        const obj = await sql.query`select * from LOAISANPHAM`;
        return obj;
    },

    async getAllSupplier(){
        await sql.connect(sqlConfig);
        const obj = await sql.query`select * from NHACUNGCAP`;
        return obj;
    },

    async getAllProductID(){
        await sql.connect(sqlConfig);
        const obj = await sql.query`select MaSanPham from SANPHAM`;
        return obj;
    },

    async addProduct(id, name, type, supplier, country, size, count, des, price){
        await sql.connect(sqlConfig);
        const obj = await sql.query`insert into SanPham values (${id}, ${type}, ${supplier}, ${name}, 0, ${country}, ${size}, 
                            ${count}, ${des}, 1, 1, ${price})`;
        var d = new Date();
        d.setHours(d.getHours() + 7);
        const obj2 = await sql.query`insert into LichSuGia values (${id}, ${d}, ${price})`;
        return obj;
    },

    async delProduct(id){
        await sql.connect(sqlConfig);
        const obj = await sql.query`update SANPHAM set TinhTrang = 0 where MaSanPham = ${id}`;
        return obj;
    },

    async updateProduct(id, name, type, supplier, country, size, count, des, price, flag){
        await sql.connect(sqlConfig);
        if (flag){
            const obj = await sql.query`update SANPHAM set TenSanPham = ${name}, MaLoai = ${type},
                        MaNhaCungCap = ${supplier}, QuocGiaSanXuat = ${country}, KichThuoc = ${size},
                        DonViDoLuong = ${count}, MoTaChiTiet = ${des}, GiaSanPham = ${price} where MaSanPham = ${id}`;
            var d = new Date();
            d.setHours(d.getHours() + 7);
            const obj2 = await sql.query`insert into LichSuGia values (${id}, ${d}, ${price})`;
        }
        else{
            const obj = await sql.query`update SANPHAM set TenSanPham = ${name}, MaLoai = ${type},
                        MaNhaCungCap = ${supplier}, QuocGiaSanXuat = ${country}, KichThuoc = ${size},
                        DonViDoLuong = ${count}, MoTaChiTiet = ${des} where MaSanPham = ${id}`;
        }
    }
};