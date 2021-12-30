import express from "express";
import morgan from 'morgan';
import viewMdw from "./middlewares/view.mdw.js";
import AuthModels from "./models/auth.models.js";

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: true
}));

viewMdw(app);

app.get("/", async (req, res) => {
    res.render("login");
});

app.get("/register", async function (req, res){
    res.render("register");
});

app.post("/login", async function (req, res){
    const username = req.body.txtUsername;
    const password = req.body.txtPassword;
    const obj = await AuthModels.getAllAccount(username, password);
    console.log(obj);
    if (obj.rowsAffected[0] !== 0){
        if (obj.recordset[0].MaKhachHang !== null){
            console.log("Khach hang");
            res.render("customer");
        }
        else{
            console.log("Nhan vien");
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

const port = 3000;

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
