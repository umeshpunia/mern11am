const mongoose = require("mongoose");

const Category = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  addedOn: {
    type: Date,
    default: Date.now(),
  },
  picture: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("category", Category);
