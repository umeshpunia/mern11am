const express = require("express");
const multer = require("multer");
const CatSchema=require("../models/category.model")
const router = express.Router();

// uploading file
const userImagePath = "./assets/images/category";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, userImagePath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
    console.log(file);
  },
});

const upload = multer({ storage }).single("picture");

// add category
router.post("/add-cat", (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(506).json({ status: 506, msg: err.message });
    } else if (err) {
      res.status(507).json({ status: 507, msg: err.message });
    }

    const { title, description} = req.body;

    const picture = req.file.filename;

    if (!title || !description)
      return res.json({ status: 400, msg: "Please Fill Fields" });

      let insCat = new CatSchema({
        title,
        description,
        picture,
      });

      insCat
        .save()
        .then((data) => {
          res.json({ status: 200, msg: "Success" });
        })
        .catch((err) => {
          res.json({ status: 502, msg: err.message });
        });
    
  });
});


// all categories
router.get("/", (req, res) => {
  CatSchema.find({}, (err, data) => {
    if (err) return res.status(500).json({ status: 500, msg: err.message });
    if (data.length > 0) return res.json({ status: 200, msg: data });
    res.json({ status: 200, msg: "No Category" });
  });
});


// delete cat
router.delete("/delete/:_id",(req,res)=>{
  const {_id}=req.params

  CatSchema.findByIdAndDelete({_id},(err,data)=>{
    if (err) return res.status(500).json({ status: 500, msg: err.message });
    if (!data) return res.json({ status: 400, msg: "Please Try Again" });
    res.json({ status: 200, msg: "Deleted" });
  })
})



module.exports = router;
