const express = require("express");
const userController = require("../controllers/user.controller");

//Setting up the Express Router
const Router = express.Router();

//Setting up Routes
Router.get("/register", userController.getSignup);
Router.post("/register", userController.postSignup);
Router.get("/login", userController.getLogin);
Router.post("/login", userController.postLogin);
Router.get("/logout", userController.logout);
Router.get("/home", userController.getHome);

module.exports = Router;
