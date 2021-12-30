import express from "express";
import morgan from 'morgan';
import viewMdw from "./middlewares/view.mdw.js";
import loginModels from "./models/login.models.js";

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: true
}));

viewMdw(app);

app.get("/", async (req, res) => {
    res.render("login")
});

app.post("/login", async function (req, res){
    const username = req.body.txtUsername;
    const password = req.body.txtPassword;
    const obj = await loginModels.getAllAccount(username, password);
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

const port = 3000;

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
