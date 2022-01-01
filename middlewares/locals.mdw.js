import productModels from "../models/product.models.js";
import AuthModels from "../models/auth.models.js";

export default function (app) {
  app.use(async function (req, res, next) {
    const obj = await productModels.getAllParentsProductType();
    res.locals.ParentType = obj.recordset;
    next();
  });
  app.use(async function (req, res, next) {
    if (typeof req.session.auth === "undefined") {
      req.session.auth = false;
    }
    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    if (res.locals.authUser) {
      const obj = await AuthModels.getUserByID(res.locals.authUser.MaKhachHang);
      res.locals.authUser = obj.recordset[0];
    }
    next();
  });
}
