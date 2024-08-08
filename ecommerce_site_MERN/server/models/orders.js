const { Schema, model } = require("mongoose");

const ordersSchema = new Schema(
  {
    notebooks: [
      {
        notebook: {
          type: Object,
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],
    user: {
      name: String,
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = model("Order", ordersSchema);
