const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");
const User = require("../models/user");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.json({ error: "You must be logged in" });
  }
  const token = authorization.replace("Fayzullo ", "");
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.json({ error: "You must be logged in" });
    }
    const { id } = payload;
    User.findById(id).then((userData) => {
      req.user = userData;
      next();
    });
  });
};
