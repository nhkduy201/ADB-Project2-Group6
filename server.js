import express from "express";
import morgan from "morgan";
import moment from "moment";

import viewMdw from "./middlewares/view.mdw.js";
import localMdw from "./middlewares/locals.mdw.js";
import sessionMdw from "./middlewares/session.mdw.js";
import authMdw from "./middlewares/auth.mdw.js";
import AuthModels from "./models/auth.models.js";
import ProductModels from "./models/product.models.js";
import CartModels from "./models/cart.models.js";
import SalaryModels from "./models/salary.models.js";
const app = express();

app.use(morgan("dev"));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/public", express.static("public"));

viewMdw(app);
sessionMdw(app);
localMdw(app);

app.get("/", async (req, res) => {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/admin/products/add", async function (req, res) {
  const obj1 = await ProductModels.getAllProductType();
  const typeList = obj1.recordset;
  const obj2 = await ProductModels.getAllSupplier();
  const supList = obj2.recordset;
  res.render("add", {
    layout: "bs4.hbs",
    typeList,
    supList,
  });
});

app.post("/admin/products/add", async function (req, res) {
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
  const ret = ProductModels.addProduct(
    id,
    name,
    type,
    supplier,
    country,
    size,
    count,
    des,
    price
  );
  console.log(id);
  res.redirect("/admin/products/1");
});

app.get("/admin/products/edit", async function (req, res) {
  const id = req.query.id;
  const obj = await ProductModels.findProductById(id);
  const product = obj.recordset[0];
  const obj1 = await ProductModels.getAllProductType();
  const typeList = obj1.recordset;
  const obj2 = await ProductModels.getAllSupplier();
  const supList = obj2.recordset;
  for (var i = 0; i < typeList.length; i++) {
    if (typeList[i].MaLoai === product.MaLoai) {
      product.TenLoai = typeList[i].TenLoai;
      break;
    }
  }
  for (var i = 0; i < supList.length; i++) {
    if (supList[i].MaNhaCungCap === product.MaNhaCungCap) {
      product.TenNhaCungCap = supList[i].TenNhaCungCap;
      break;
    }
  }
  console.log(product);
  res.render("edit", {
    layout: "bs4.hbs",
    product,
    typeList,
    supList,
  });
});

app.post("/admin/products/del", async function (req, res) {
  const id = req.body.ProID;
  const ret = ProductModels.delProduct(id);
  res.redirect("/admin/products/1");
});

app.post("/admin/products/patch", async function (req, res) {
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
  const price = req.body.ProPrice;
  const obj = await ProductModels.findProductById(id);
  const product = obj.recordset[0];
  var flag = true;
  if (product.GiaSanPham == price) flag = false;
  await ProductModels.updateProduct(
    id,
    name,
    type,
    supplier,
    country,
    size,
    count,
    des,
    price,
    flag
  );
  res.redirect("/admin/products/1");
});

app.get("/admin/products/history", async function (req, res) {
  const id = req.query.id;
  const show = req.query.show || "top-5";
  if (show === "top-5") var limit = 5;
  const obj = await ProductModels.getAllPriceHistory(id, limit);
  var products = obj.recordset;
  for (var i = 0; i < products.length; i++) {
    products[i].No = i + 1;
  }
  res.render("history", {
    layout: "bs4.hbs",
    products,
    id,
  });
});

app.get("/admin/products/statistic", async function (req, res) {
  const obj = await ProductModels.getMaxDate();
  const maxDate1 = moment(obj[0].recordset[0][""]);
  const maxDate2 = moment(obj[1].recordset[0][""]);
  const maxDate3 = moment(obj[2].recordset[0][""]);
  const maxDate4 = moment(obj[3].recordset[0][""]);

  var startDate = moment("2020-01-01");
  const endDate = moment.max(maxDate1, maxDate2, maxDate3, maxDate4);

  var result = [];

  while (startDate.isBefore(endDate)) {
    result.push(startDate.format("YYYY-MM"));
    startDate.add(1, "month");
  }

  var sum1 = 0,
    sum2 = 0,
    sum3 = 0,
    sum4 = 0;
  var lst = [];

  const date = req.query.date;
  if (date !== undefined) {
    lst = date.split("-");
    lst[0] = parseInt(lst[0]);
    lst[1] = parseInt(lst[1]);
    const obj = await ProductModels.getAllOutcome(lst[0], lst[1]);
    sum1 = obj[0].recordset[0]["SUM"];
    sum2 = obj[1].recordset[0]["SUM"];
    sum3 = obj[2].recordset[0]["SUM"];
    sum4 = obj[3].recordset[0]["SUM"];
  }

  res.render("statistic", {
    layout: "bs4.hbs",
    dates: result,
    year: lst[0],
    month: lst[1],
    TongHoaDon: sum1,
    TongDoiHang: sum2,
    TongNhapHang: sum3,
    TongXuatHang: sum4,
    TongChiPhi:
      parseInt(sum1) + parseInt(sum2) - parseInt(sum3) + parseInt(sum4),
  });
});

app.get("/admin/statistic/bill", async function (req, res) {
  const year = req.query.year;
  const month = req.query.month;
  var page = req.query.page;
  page = parseInt(page);
  if (page < 1) page = 1;
  const offset = (page - 1) * 10;
  const obj = await ProductModels.getDetailBill(year, month, 10, offset);
  var bills = obj.recordset;
  res.render("bill", {
    layout: "bs4.hbs",
    bills,
    month,
    year,
    next: page + 1,
    prev: page - 1,
  });
});

app.get("/admin/statistic/exchange", async function (req, res) {
  const year = req.query.year;
  const month = req.query.month;
  var page = req.query.page;
  page = parseInt(page);
  if (page < 1) page = 1;
  const offset = (page - 1) * 10;
  const obj = await ProductModels.getDetailExchange(year, month, 10, offset);
  var exchanges = obj.recordset;
  res.render("exchange", {
    layout: "bs4.hbs",
    exchanges,
    month,
    year,
    next: page + 1,
    prev: page - 1,
  });
});

app.get("/admin/statistic/import", async function (req, res) {
  const year = req.query.year;
  const month = req.query.month;
  var page = req.query.page;
  page = parseInt(page);
  if (page < 1) page = 1;
  const offset = (page - 1) * 10;
  const obj = await ProductModels.getDetailImport(year, month, 10, offset);
  var imports = obj.recordset;
  res.render("import", {
    layout: "bs4.hbs",
    imports,
    month,
    year,
    next: page + 1,
    prev: page - 1,
  });
});

app.get("/admin/statistic/export", async function (req, res) {
  const year = req.query.year;
  const month = req.query.month;
  var page = req.query.page;
  page = parseInt(page);
  if (page < 1) page = 1;
  const offset = (page - 1) * 10;
  const obj = await ProductModels.getDetailExport(year, month, 10, offset);
  var exports = obj.recordset;
  res.render("export", {
    layout: "bs4.hbs",
    exports,
    month,
    year,
    next: page + 1,
    prev: page - 1,
  });
});

app.get("/admin/products/:page", async function (req, res) {
  var page = req.params.page || 1;
  page = parseInt(page);
  if (page < 1) page = 1;
  const offset = (page - 1) * 10;
  const obj = await ProductModels.findAllProducts(10, offset);
  const products = obj.recordset;
  res.render("admin", {
    layout: "bs4.hbs",
    products,
    next: page + 1,
    prev: page - 1,
  });
});

app.post("/login", async function (req, res) {
  const username = req.body.txtUsername;
  const password = req.body.txtPassword;
  const obj = await AuthModels.getAllAccount(username, password);
  if (obj.rowsAffected[0] !== 0) {
    if (obj.recordset[0].MaKhachHang !== null) {
      req.session.customerAuth = true;
      req.session.authUser = { MaKhachHang: obj.recordset[0].MaKhachHang };
      res.redirect("/products/customer/bycat?");
    } else {
      console.log("Nhan vien");
      const employee = await AuthModels.findEmployeeById(
        obj.recordset[0].MaNhanVien
      );
      if (employee.recordset[0].LoaiNhanVien === "Quản Lý")
        res.redirect("/admin/products/1");
      else {
        const obj2 = await AuthModels.findEmployeeById(
          obj.recordset[0].MaNhanVien
        );
        req.session.staffAuth = true;
        req.session.authUser = obj2.recordset[0];
        res.redirect("/salary/history/1");
      }
    }
  }
});

app.post("/register", async function (req, res) {
  const username = req.body.txtUsername;
  const password = req.body.txtPassword;
  const passwordConfirm = req.body.txtConfirm;
  const name = req.body.txtName;
  const phone = req.body.txtPhone;
  const dob = req.body.txtDOB;
  const address = req.body.txtAddress;
  if (password !== passwordConfirm) {
    res.render("register", { err_message: "Password does not match" });
  } else {
    const obj = await AuthModels.findByUsername(username);
    if (obj.rowsAffected[0] === 1) {
      res.render("register", {
        err_message: "The username has already existed",
      });
    }
  }
  const newDate = dob.replaceAll("-", "");
  const ret = await AuthModels.addCustomer(name, phone, newDate, address);
  const success = await AuthModels.addAccount(username, password, ret);
  res.redirect("/");
});

app.get("/profile", async function (req, res) {
  const obj = await AuthModels.getUserDetailByID(
    res.locals.authUser.MaKhachHang
  );
  const user = obj.recordset[0];
  user.NgaySinhKhachHang = moment(user.NgaySinhKhachHang).format("DD/MM/YYYY");
  res.render("profile", {
    layout: "bs4customer.hbs",
    user,
  });
});

app.post("/logout", async function (req, res) {
  req.session.staffAuth = false;
  req.session.customerAuth = false;
  req.session.authUser = null;
  res.redirect("/");
});

app.get("/products/bycat", async function (req, res) {
  const type = req.query.id;
  var page = req.query.page || 1;
  const subType = await ProductModels.findSubType(type);
  const lst = subType.recordset;
  page = parseInt(page);
  if (page < 1) page = 1;
  const offset = (page - 1) * 10;
  const obj = await ProductModels.findProductByTypeId(type, 10, offset);
  const products = obj.recordset;
  res.render("byCat", {
    layout: "bs4.hbs",
    subType: lst,
    products,
    next: page + 1,
    prev: page - 1,
    type,
  });
});

app.get("/products/customer/bycat", async function (req, res) {
  const type = req.query.id || 1;
  var page = req.query.page || 1;
  const subType = await ProductModels.findSubType(type);
  const lst = subType.recordset;
  const limit = 12;
  page = parseInt(page);
  if (page < 1) page = 1;
  const offset = (page - 1) * 10;
  const obj = await ProductModels.findProductByTypeId(
    type,
    limit,
    offset,
    "on"
  );
  const products = obj.recordset.map((x) => {
    x.GiaHienTai = parseInt(x.GiaHienTai * (1 - x.PhanTramGiamGia));
    return x;
  });
  // console.log(products);
  res.render("customer", {
    layout: "bs4customer.hbs",
    subType: lst,
    products,
    next: products.length == limit ? page + 1 : page,
    prev: page > 1 ? page - 1 : page,
    type,
  });
});

app.get("/products/detail/:id", async function (req, res) {
  const proId = req.params.id || 1;
  const obj = await ProductModels.findOnlineProductById(proId);
  const product = obj.recordset[0];
  const endTime = product.ThoiGianKetThuc.toISOString().slice(0, 19).split("T");
  product.ThoiGianKetThuc = `${endTime[1]} ${endTime[0]}`;
  product.GiaHienTai = parseInt(
    product.GiaHienTai * (1 - product.PhanTramGiamGia)
  );
  res.render("detail", {
    layout: "bs4customer.hbs",
    product,
    sale: product.HinhThucKhuyenMai !== null,
  });
});

app.get("/cart", authMdw.customerAuth, async function (req, res) {
  const clear = req.query.clear || 0;
  const obj = await CartModels.getAllItemInCart(
    res.locals.authUser.MaKhachHang
  );
  const items = obj.recordset.map((x) => {
    x.ThanhTien = x.DonGiaTrongGio * x.SoLuongTrongGio;
    return x;
  });
  res.render("cart", {
    layout: "bs4customer.hbs",
    items,
    empty: items.length === 0,
    clear: +clear == 1,
  });
});

app.post("/cart/add", authMdw.customerAuth, async function (req, res) {
  const { id, quantity } = req.body;
  await CartModels.addItemToCart(id, res.locals.authUser.MaKhachHang, quantity);
  const obj2 = await AuthModels.getUserByID(res.locals.authUser.MaKhachHang);
  res.locals.authUser = obj2.recordset[0];
  res.redirect(req.headers.referer);
});

app.post("/cart/del", authMdw.customerAuth, async function (req, res) {
  await CartModels.del(req.body.id, res.locals.authUser.MaKhachHang);
  res.redirect(req.headers.referer);
});

app.post("/cart/checkout", authMdw.customerAuth, async function (req, res) {
  await CartModels.checkout(res.locals.authUser.MaKhachHang);
  res.redirect("/cart?clear=1");
});

app.get("/salary/history/:page", authMdw.staffAuth, async function (req, res) {
  var page = req.params.page || 1;
  const limit = 10;
  page = parseInt(page);
  if (page < 1) page = 1;
  const offset = (page - 1) * limit;
  const obj = await SalaryModels.getSalaryHistory(
    res.locals.authUser.MaNhanVien,
    limit,
    offset
  );
  res.render("staff", {
    layout: "bs4staff.hbs",
    histories: obj.recordset,
    next: obj.recordset.length == limit ? page + 1 : page,
    prev: page > 1 ? page - 1 : page,
  });
});

const port = 3000;

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
