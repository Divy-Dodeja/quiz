const express = require("express");
const gameController = require("../controllers/game.controller");

//Setting up the Express Router
const Router = express.Router();

//Setting up Routes
Router.get("/quiz", gameController.getQuiz);
Router.post("/quiz", gameController.postQuiz);
Router.get("/results", gameController.getResults);

module.exports = Router;
