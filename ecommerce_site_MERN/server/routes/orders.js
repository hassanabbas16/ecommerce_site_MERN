const { Router } = require("express");
const auth = require("../middleware/auth");
const Order = require("../models/orders");
const router = Router();

router.get("/get", auth, async (req, res) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id }).populate(
      "user.userId"
    );
    res.json({
      orders: orders
        .map((s) => ({
          ...s._doc,
          price: s.notebooks.reduce((total, c) => {
            return (total += c.count * c.notebook.price);
          }, 0),
        }))
        .reverse(),
    });
  } catch (error) {
    console.log(error);
  }
});

// ORDER ORDERS
router.get("/post", auth, async (req, res) => {
  try {
    const user = await req.user.populate("cart.items.notebookId");
    const notebooks = user.cart.items.map((s) => ({
      count: s.count,
      notebook: { ...s.notebookId._doc },
    }));
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      notebooks,
    });
    await order.save();
    await req.user.cleanCart();
    res.json({ msg: "Successfully Ordered!" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
