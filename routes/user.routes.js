const express = require("express");
const bcrypt = require("bcrypt");
const AdminUserSchema = require("../models/user.model");
const multer = require("multer");
const router = express.Router();

// uploading file
const userImagePath = "./assets/images/users";
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

// add User
router.post("/register", (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(506).json({ status: 506, msg: err.message });
    } else if (err) {
      res.status(507).json({ status: 507, msg: err.message });
    }

    const { email, password, name } = req.body;

    const picture = req.file.filename;

    if (!email || !password || !name)
      return res.json({ status: 400, msg: "Please Fill Fields" });

    bcrypt.hash(password, 12, (err, hashPass) => {
      if (err) return res.json({ status: 500, msg: err.message });
      if (!hashPass) return res.json({ status: 501, msg: "Something Wrong" });

      let insUser = new AdminUserSchema({
        email,
        password: hashPass,
        name,
        picture,
      });

      insUser
        .save()
        .then((data) => {
          res.json({ status: 200, msg: "Success" });
        })
        .catch((err) => {
          res.json({ status: 502, msg: err.message });
        });
    });
  });
});

// login user

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.json({ status: 400, msg: "Please Fill Fields" });

  AdminUserSchema.findOne({ email }, (err, data) => {
    if (err) return res.status(500).json({ status: 500, msg: err.message });
    if (!data)
      return res.status(404).json({ status: 404, msg: "No User Available" });

    // password match
    let dbPass = data.password;

    bcrypt.compare(password, dbPass, (err, valid) => {
      if (err) return res.status(501).json({ status: 501, msg: err.message });
      if (!valid)
        return res
          .status(404)
          .json({ status: 404, msg: "No User Available 1" });

      res.json({ status: 200, msg: "login success" });
    });
  });
});

router.get("/", (req, res) => {
  AdminUserSchema.find({}, (err, data) => {
    if (err) return res.status(500).json({ status: 500, msg: err.message });
    if (data.length > 0) return res.json({ status: 200, msg: data });
    res.json({ status: 200, msg: "No Users" });
  });
});

router.put("/password", (req, res) => {
  const { op, np, email } = req.body;

  AdminUserSchema.findOne({ email }, (err, data) => {
    if (err) return res.status(500).json({ status: 500, msg: err.message });
    if (!data)
      return res.status(404).json({ status: 404, msg: "No User Found" });

    // match old password
    bcrypt.compare(op, data.password, (err, valid) => {
      if (err) return res.status(501).json({ status: 501, msg: err.message });
      if (!valid)
        return res
          .status(403)
          .json({ status: 403, msg: "Please Enter Correct Old Password" });

      // create a new hash of np
      bcrypt.hash(np, 12, (err, hashPass) => {
        if (err) return res.status(502).json({ status: 502, msg: err.message });
        if (!hashPass)
          return res.status(503).json({ status: 503, msg: "Something Wrong" });

        // update pass to db
        AdminUserSchema.findByIdAndUpdate(
          { _id: data._id },
          { password: hashPass },
          (err, result) => {
            if (err)
              return res.status(504).json({ status: 504, msg: err.message });
            if (!result)
              return res
                .status(504)
                .json({ status: 504, msg: "Something Wrong1" });

                res.json({status:200,msg:"Updated Successfully"})
          }
        );
      });
    });
  });
});

module.exports = router;
