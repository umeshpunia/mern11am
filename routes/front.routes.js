const express = require("express");
const ProSchema = require("../models/product.model");
const CatSchema = require("../models/category.model");
const router = express.Router();

// all products
router.get("/products", (req, res) => {
  ProSchema.find({}, (err, data) => {
    if (err) return res.status(500).json({ status: 500, msg: err.message });
    if (data.length > 0) return res.json({ status: 200, msg: data });
    res.json({ status: 200, msg: "No Products" });
  });
});

// single product
router.get("/product/:_id", (req, res) => {
  const { _id } = req.params;

  ProSchema.findOne({ _id }, (err, data) => {
    if (err) return res.status(500).json({ status: 500, msg: err.message });
    if (!data)
      return res.status(404).json({ status: 404, msg: "404 Not Found" });
    res.json({ status: 200, msg: data });
  });
});

// all categories
router.get("/categories", (req, res) => {
  CatSchema.find({}, (err, data) => {
    if (err) return res.status(500).json({ status: 500, msg: err.message });
    if (data.length > 0) return res.json({ status: 200, msg: data });
    res.json({ status: 200, msg: "No Category" });
  });
});

// single cat
router.get("/category/:_id", (req, res) => {
  const { _id } = req.params;
  CatSchema.findOne({ _id }, (err, data) => {
    if (err) return res.status(500).json({ status: 500, msg: err.message });
    if (!data)
      return res.status(404).json({ status: 404, msg: "404 Not Found" });
    res.json({ status: 200, msg: data });
  });
});


// get products via category
router.get("/product/cat/:category",(req,res)=>{
  const {category}=req.params

  ProSchema.find({category}, (err, data) => {
    if (err) return res.status(500).json({ status: 500, msg: err.message });
    if (data.length > 0) return res.json({ status: 200, msg: data });
    res.json({ status: 200, msg: "No Products" });
  });

})
module.exports = router;
