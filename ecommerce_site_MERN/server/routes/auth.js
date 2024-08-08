const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const { registerValidators } = require("../utils/validators");
const generateToken = require("../config/generateToken");

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.json({ error: "Please add amail or password" });
    }
    const user = await User.findOne({ email });

    if (user) {
      const samePass = await bcrypt.compare(password, user.password);
      if (samePass) {
        res.json({
          msg: "Successfully Login",
          token: generateToken(user._id),
          user,
        });
      } else {
        return res.json({ error: "Invalid email or password" });
      }
    } else {
      return res.json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
  }
});

// REGISTER
router.post("/register", registerValidators, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        error: errors.array()[0].msg,
      });
    }
    const hashPass = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashPass,
      cart: { items: [] },
    });

    await user
      .save()
      .then((user) => {
        res.json({ msg: "Added successfully", user });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
