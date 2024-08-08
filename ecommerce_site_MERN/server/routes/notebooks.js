const { Router } = require("express");
const { validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const Notebook = require("../models/notebook");
const { notebookValidators } = require("../utils/validators");
const router = Router();

// GET ALL NOTEBOOKS
router.get("/", async (req, res) => {
  try {
    const pageSize = 6;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const count = await Notebook.countDocuments({ ...keyword });
    const notebooks = await Notebook.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate("userId", "email name")
      .select("price title img descr phone")
      .sort({ _id: -1 });
    res.json({ notebooks, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    console.log(error);
  }
});

// GET ONE NOTEBOOK
router.get("/:id", async (req, res) => {
  const notebook = await Notebook.findById(req.params.id);
  res.json({ notebook });
});

// EDIT NOTEBOOK
router.put("/edit", auth, notebookValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    const { title, price, descr, img, phone, id } = req.body;
    if (!errors.isEmpty()) {
      return res.json({ error: errors.array()[0].msg });
    }

    await Notebook.findByIdAndUpdate(id, {
      title,
      price,
      img,
      descr,
      phone,
    });

    const notebook = await Notebook.findById(id).populate(
      "userId",
      "email name"
    );

    res.json({ msg: "Successfully Updated!", notebook });
  } catch (error) {
    console.log(error);
  }
});

// DELETE NOTEBOOK
router.delete("/remove/:id", auth, async (req, res) => {
  try {
    await Notebook.deleteOne({ _id: req.params.id });
    res.json({ msg: "Succesfully deleted!" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
