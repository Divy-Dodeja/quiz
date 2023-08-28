const express = require("express");
const gameController = require("../controllers/game.controller");
const middlewares = require("../middlewares/auth")

//Setting up the Express Router
const Router = express.Router();

//Setting up Routes
Router.get("/quiz", middlewares.checkUser, gameController.getQuiz);
Router.post("/quiz", middlewares.checkUser, gameController.postQuiz);
Router.get("/results", middlewares.checkUser, gameController.getResults);

module.exports = Router;
