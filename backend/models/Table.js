const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["FREE", "OCCUPIED"],
    default: "FREE"
  },
  currentOrderTotal: {
    type: Number,
    default: 0
  },
  combinedWith: {
    type: [Number],
    default: []
  }
});

module.exports = mongoose.model("Table", tableSchema);
