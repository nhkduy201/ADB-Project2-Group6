import express from "express";
import morgan from 'morgan';
import viewMdw from "./middlewares/view.mdw.js";
import localMdw from "./middlewares/local.mdw.js";
import productModels from "./models/product.models.js";
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

app.get("/admin/products/:page", async function (req, res){
    var page = req.params.page || 1;
    page = parseInt(page);
    if (page < 1)
        page = 1;
    const offset = (page-1)*10;
    const obj = await productModels.findAllProducts(10, offset);
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
    const obj = await productModels.findProductByTypeId(type, 10, offset);
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
