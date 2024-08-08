const User = require("../models/user");
const Orders = require("../models/orders");
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const { validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const { updateProfileValidators } = require("../utils/validators");

// UPDATE PROFILE
router.put("/", auth, updateProfileValidators, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ error: errors.array()[0].msg });
    }

    const hashPass = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(req.user._id, {
      name,
      email,
      password: hashPass,
    });
    res.json({ msg: "Successfully Updated!" });
  } catch (error) {
    console.log(error);
  }
});

// GET ORDERED NOTEBOOK PROFILE
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const data = await Orders.find({}).sort({ _id: -1 });
    const dataFilter = [];
    data.forEach((item) => {
      if (item.notebooks.length > 0) {
        item.notebooks.forEach((notebook) => {
          if (notebook.notebook.userId == userId) {
            dataFilter.push({
              notebook,
              orderBy: item.user,
              createdAt: item.createdAt,
            });
          }
        });
      }
    });

    res.json({ data: dataFilter });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
