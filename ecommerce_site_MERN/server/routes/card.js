const { Router } = require("express");
const auth = require("../middleware/auth");
const Notebook = require("../models/notebook");
const router = Router();

function mapCart(cart) {
  return cart.items.map((s) => ({
    ...s.notebookId._doc,
    id: s.notebookId.id,
    count: s.count,
  }));
}

function computePrice(notebooks) {
  return notebooks.reduce((total, notebook) => {
    return (total += notebook.price * notebook.count);
  }, 0);
}

// ADD CARD
router.post("/add", auth, async (req, res) => {
  const notebook = await Notebook.findById(req.body.id);
  await req.user.addToCart(notebook);
  res.json({ msg: "Successfully Added to Card!", notebook });
});

// REMOVE CARD
router.post("/remove", auth, async (req, res) => {
  await req.user.removeFromCart(req.body.id);
  const user = await req.user.populate("cart.items.notebookId");
  const notebooks = mapCart(user.cart);
  const cart = {
    notebooks,
    price: computePrice(notebooks),
  };

  res.json({ msg: "Removed Item from Card!", cart });
});

// MINUS CARD
router.post("/minus", auth, async (req, res) => {
  await req.user.minusFromCart(req.body.id);
  const user = await req.user.populate("cart.items.notebookId");
  const notebooks = mapCart(user.cart);
  const cart = {
    notebooks,
    price: computePrice(notebooks),
  };
  res.json({ msg: "Minused from Card!", cart });
});

// PLUS CARD
router.post("/plus", auth, async (req, res) => {
  const notebook = await Notebook.findById(req.body.id);
  await req.user.addToCart(notebook);
  const user = await req.user.populate("cart.items.notebookId");
  const notebooks = mapCart(user.cart);
  const cart = {
    notebooks,
    price: computePrice(notebooks),
  };
  res.json({ msg: "Successfully Plused to Card!", cart });
});

// GET ALL OWN CARDS
router.get("/", auth, async (req, res) => {
  const user = await req.user.populate("cart.items.notebookId");
  const notebooks = mapCart(user.cart);
  notebooks.reverse();
  res.json({
    notebooks,
    price: computePrice(notebooks),
  });
});

module.exports = router;
