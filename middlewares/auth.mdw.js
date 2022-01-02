export default {
  customerAuth(req, res, next) {
    if (typeof req.session == "undefined" || req.session.customerAuth === false) {
      return res.redirect("/");
    }
    next();
  },
  staffAuth(req, res, next) {
    if (typeof req.session == "undefined" || req.session.staffAuth === false) {
      return res.redirect("/");
    }
    next();
  }
}
