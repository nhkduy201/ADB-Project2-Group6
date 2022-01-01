export default function auth(req, res, next) {
  if (typeof req.session == "undefined" || req.session.auth === false) {
    // req.session.retUrl = req.originalUrl;
    return res.redirect("/");
  }
  next();
}
