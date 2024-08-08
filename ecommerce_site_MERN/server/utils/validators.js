const { body } = require("express-validator");
const User = require("../models/user");

exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Enter your email correctly")
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("This email is already exist.");
        }
      } catch (error) {
        console.log(error);
      }
    })
    .normalizeEmail(),
  body("password", "Password should be min 6 symbols")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body("confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password should be similar");
      }
      return true;
    })
    .trim(),
  body("name").isLength({ min: 3 }).withMessage("Name should be min 3 symbols"),
];

exports.notebookValidators = [
  body("title")
    .isLength({ min: 2 })
    .withMessage("Minimum length for title should be 2 symbols")
    .trim(),
  body("price").isNumeric().withMessage("Write correct price"),
  body("img").isLength({ min: 1 }).withMessage("Please input Image"),
  body("descr")
    .isLength({ min: 10 })
    .withMessage("Description should be min 10 symbols"),
  body("phone")
    .isLength({ min: 9, max: 12 })
    .withMessage("Please check your phone number!"),
];

exports.updateProfileValidators = [
  body("name")
    .isLength({ min: 3 })
    .withMessage("Minimum length for title should be 3 symbols")
    .trim(),
  body("email")
    .isEmail()
    .withMessage("Enter your email correctly")
    .custom(async (value, { req }) => {
      try {
        if (req.body.myEmail === value) {
          return;
        }
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("That User already exist with that email");
        }
      } catch (error) {
        console.log(error);
      }
    })
    .trim()
    .normalizeEmail(),
  body("password", "Password should be min 6 symbols")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body("confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password should be similar");
      }
      return true;
    })
    .trim(),
];
