const router = require("express").Router();
const { validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const Notebook = require("../models/notebook");
const { notebookValidators } = require("../utils/validators");

// CREATE NOTEBOOK
router.post("/", auth, notebookValidators, async (req, res) => {
  const errors = validationResult(req);
  const { title, price, descr, img, phone } = req.body;
  if (!errors.isEmpty()) {
    return res.json({ error: errors.array()[0].msg });
  }
  const notebook = new Notebook({
    title,
    price,
    img,
    descr,
    phone,
    userId: req.user,
  });

  try {
    await notebook.save();
    res.json({ msg: "Successfully added!" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
