const express = require("express");
const userController = require("../controllers/user.controller");
const middlewares = require('../middlewares/auth')
const multer = require("multer");
const path = require("path")

//Setting disk storage
const storage = multer.diskStorage({
  destination: "src/public/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//Initialising multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

//Check file type
function checkFileType(file, cb) {
  const fileType = /jpeg|jpg|png/;
  const extName = fileType.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileType.test(file.mimetype);

  if (mimetype && extName) {
    return cb(null, true);
  } else {
    cb("File not Supported");
  }
}

//Setting up the Express Router
const Router = express.Router();

//Setting up Routes
Router.get("/register", userController.getSignup);
Router.post(
  "/register",
  upload.single("profileImage"),
  userController.postSignup
);
Router.get("/login", userController.getLogin);
Router.post("/login", userController.postLogin);
Router.get("/logout", middlewares.checkUser, userController.logout);
Router.get("/home", middlewares.checkUser, userController.getHome);

module.exports = Router;
