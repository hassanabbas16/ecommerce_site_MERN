const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { PORT, MONGO_URL } = require("./config/config");

// ROUTES
const notebooksRoutes = require("./routes/notebooks");
const addRoutes = require("./routes/add");
const cardRoutes = require("./routes/card");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const ordersRoutes = require("./routes/orders");

const corsOptions = {
  origin: "*",
  credential: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/notebooks", notebooksRoutes);
app.use("/add", addRoutes);
app.use("/card", cardRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/orders", ordersRoutes);

async function start() {
  try {
    await mongoose.connect(MONGO_URL);

    app.listen(PORT, () => {
      console.log(`Server has been started on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
