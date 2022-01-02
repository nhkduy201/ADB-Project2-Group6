import productModels from "../models/product.models.js";
import AuthModels from "../models/auth.models.js";

export default function (app) {
  app.use(async function (req, res, next) {
    if (typeof req.session.customerAuth === "undefined") {
      req.session.customerAuth = false;
    }
    if (typeof req.session.staffAuth === "undefined") {
      req.session.staffAuth = false;
    }
    res.locals.customerAuth = req.session.customerAuth;
    if (res.locals.customerAuth) {
      const obj = await AuthModels.getUserByID(
        req.session.authUser.MaKhachHang
      );
      res.locals.authUser = obj.recordset[0];
    } else {
      res.locals.staffAuth = req.session.staffAuth;
      res.locals.authUser = req.session.authUser;
    }
    next();
  });

  app.use(async function (req, res, next) {
    const obj = await productModels.getAllParentsProductType();
    res.locals.ParentType = obj.recordset;
    next();
  });
}
