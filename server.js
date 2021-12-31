import express from "express";
import morgan from 'morgan';
import viewMdw from "./middlewares/view.mdw.js";
import localMdw from "./middlewares/local.mdw.js";
import AuthModels from "./models/auth.models.js";
import ProductModels from "./models/product.models.js";

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: true
}));

viewMdw(app);
localMdw(app);

app.get("/", async (req, res) => {
    res.render("login");
});

app.get("/register", function (req, res){
    res.render("register");
});

app.get('/admin/products/add', async function(req, res){
    const obj1 = await ProductModels.getAllProductType();
    const typeList = obj1.recordset;
    const obj2 = await ProductModels.getAllSupplier();
    const supList = obj2.recordset;
    res.render('add', {
        layout: 'bs4.hbs',
        typeList,
        supList
    });
});

app.post('/admin/products/add', async function(req, res){
    const name = req.body.ProName;
    const obj1 = req.body.ProType;
    const obj2 = req.body.ProSup;
    const type = obj1.split(" - ")[0];
    const supplier = obj2.split(" - ")[0];
    const country = req.body.ProCountry;
    const size = req.body.ProSize;
    const count = req.body.ProCount;
    const des = req.body.ProDes;
    const price = req.body.ProPrice;
    const obj = await ProductModels.getAllProductID();
    const idList = obj.recordset;
    var id = idList.length + 1;
    const ret = ProductModels.addProduct(id, name, type, supplier, country, size, count, des, price);
    console.log(id)
    res.redirect("/admin/products/1");
});

app.get("/admin/products/edit", async function (req, res){
    const id = req.query.id;
    const obj = await ProductModels.findProductById(id);
    const product = obj.recordset[0];
    const obj1 = await ProductModels.getAllProductType();
    const typeList = obj1.recordset;
    const obj2 = await ProductModels.getAllSupplier();
    const supList = obj2.recordset;
    for (var i = 0; i < typeList.length; i++){
        if (typeList[i].MaLoai === product.MaLoai){
            product.TenLoai = typeList[i].TenLoai;
            break;
        }
    }
    for (var i = 0; i < supList.length; i++){
        if (supList[i].MaNhaCungCap === product.MaNhaCungCap){
            product.TenNhaCungCap = supList[i].TenNhaCungCap;
            break;
        }
    }
    console.log(product);
    res.render('edit', {
        layout: 'bs4.hbs',
        product,
        typeList,
        supList
    });
});

app.post("/admin/products/del", async function(req, res){
    const id = req.body.ProID;
    const ret = ProductModels.delProduct(id);
    res.redirect("/admin/products/1");
});

app.post("/admin/products/patch", async function (req, res){
    const id = req.body.ProID;
    const name = req.body.ProName;
    const obj1 = req.body.ProType;
    const obj2 = req.body.ProSup;
    const type = obj1.split(" - ")[0];
    const supplier = obj2.split(" - ")[0];
    const country = req.body.ProCountry;
    const size = req.body.ProSize;
    const count = req.body.ProCount;
    const des = req.body.ProDes;
    const ret = ProductModels.updateProduct(id, name, type, supplier, country, size, count, des);
    res.redirect("/admin/products/1");
});

app.get("/admin/products/:page", async function (req, res){
    var page = req.params.page || 1;
    page = parseInt(page);
    if (page < 1)
        page = 1;
    const offset = (page-1)*10;
    const obj = await ProductModels.findAllProducts(10, offset);
    const products = obj.recordset;
    res.render("admin", {
        layout: "bs4.hbs",
        products,
        next: page+1,
        prev: page-1
    });
})

app.post("/login", async function (req, res){
    const username = req.body.txtUsername;
    const password = req.body.txtPassword;
    const obj = await AuthModels.getAllAccount(username, password);
    if (obj.rowsAffected[0] !== 0){
        if (obj.recordset[0].MaKhachHang !== null){
            console.log("Khach hang");
            res.render("customer");
        }
        else{
            console.log("Nhan vien");
            const employee = await AuthModels.findEmployeeById(obj.recordset[0].MaNhanVien);
            if (employee.recordset[0].LoaiNhanVien === "Quản lý")
                res.redirect('/admin/products/1');
            else
                res.render("staff");
        }
    }
    else{
        res.render("login", {err_message: "Username or password does not match"});
    }
});

app.post("/register", async function (req, res){
    const username = req.body.txtUsername;
    const password = req.body.txtPassword;
    const passwordConfirm = req.body.txtConfirm;
    const name = req.body.txtName;
    const phone = req.body.txtPhone;
    const dob = req.body.txtDOB;
    const address = req.body.txtAddress;
    if (password !== passwordConfirm){
        res.render("register", {err_message: "Password does not match"});
    }
    else {
        const obj = await AuthModels.findByUsername(username);
        if (obj.rowsAffected[0] === 1){
            res.render("register", {err_message: "The username has already existed"});
        }
    }
    const newDate = dob.replaceAll("-", "");
    const ret = await AuthModels.addCustomer(name, phone, newDate, address);
    const success = await AuthModels.addAccount(username, password, ret);
    res.redirect("/");
});

app.get("/products/bycat", async function (req, res){
    const type = req.query.id;
    var page = req.query.page || 1;
    const subType = await ProductModels.findSubType(type);
    const lst = subType.recordset;
    page = parseInt(page);
    if (page < 1)
        page = 1;
    const offset = (page-1)*10;
    const obj = await ProductModels.findProductByTypeId(type, 10, offset);
    const products = obj.recordset;
    res.render("byCat", {
        layout: "bs4.hbs",
        subType: lst,
        products,
        next: page+1,
        prev: page-1,
        type
    });
});

const port = 3000;

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
