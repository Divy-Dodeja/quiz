const gameModel = require("../models/game.model");
const errorMessage = require("../messages/errorMessage");

let storing = {};
let questionsArraySize = 0;
let gameEnd = 0;

// Generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random operator (+, -, x, /)
function getRandomOperator() {
  const operators = ["+", "-", "*", "/"];
  return operators[Math.floor(Math.random() * operators.length)];
}

// Quiz
exports.getQuiz = async (req, res, next) => {
  const userData = res.locals.user;
  const gameExist = await gameModel.findOne({ user: userData.id });
  if (!gameExist) {
    try {
      const game = await gameModel.create({
        user: userData.id,
        questions: [],
      });
    } catch (error) {
      res.status(400).json(errorMessage.errorMessage(error, null, null));
    }
  } else {
    questionsArraySize = gameExist.questions.length;
  }
  if (questionsArraySize >= 10) {
    res.redirect("/results");
  }
  if (!questionsArraySize) {
    storing = {};
  }
  // generate random equation
  let num1, num2, operator, equation, correctAnswer;
  do {
    num1 = getRandomNumber(0, 9);
    num2 = getRandomNumber(0, 9);
    operator = getRandomOperator();
    equation = `${num1} ${operator} ${num2}`;
  } while (storing.equation === equation);
  storing.equation = equation;
  correctAnswer = eval(equation);
  storing.correctAnswer = correctAnswer;
  const answerOptions = [];

  while (answerOptions.length < 4) {
    const randomAnswer = Math.floor(Math.random() * 82); // Generate answers between 0 and 19
    if (!answerOptions.includes(randomAnswer)) {
      answerOptions.push(randomAnswer);
    }
  }
  const correctAnswerIndex = Math.floor(Math.random() * 4);
  answerOptions[correctAnswerIndex] = correctAnswer;
  res.render("quiz", {
    pageTitle: "Quiz",
    equation: equation,
    answerOptions: answerOptions,
    isCompleted: questionsArraySize == 9 ? 1 : 0,
  });
};

exports.postQuiz = async (req, res, next) => {
  const userData = res.locals.user;
  if (req.body.ans) {
    storing.selectedAnswer = parseInt(req.body.ans);
  }
  else{
    storing.selectedAnswer = 100;
  }
  storing.isCorrect = storing.selectedAnswer === storing.correctAnswer ? 1 : 0;
  try {
    const fetchedDocument = await gameModel.findOne({ user: userData.id });
    fetchedDocument.questions.push({
      equation: storing.equation,
      correctAnswer: storing.correctAnswer,
      selectedAnswer: storing.selectedAnswer,
      isCorrect: storing.isCorrect,
    });
    await fetchedDocument.save();
    res.redirect("/quiz");
  } catch (error) {
    res.status(400).json(errorMessage.errorMessage(error, null, null));
  }
};

// Get Results
exports.getResults = async (req, res, next) => {
  const userData = res.locals.user;
  try {
    const gameData = await gameModel.findOne({ user: userData.id });
    let overallScore = 0;
    const questions = gameData.questions;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].isCorrect == true) overallScore++;
    }

    res.render("result", {
      pageTitle: "Results",
      results: gameData.questions,
      overallScore: overallScore,
    });
  } catch (error) {
    res.status(400).json(errorMessage.errorMessage(error, null, null));
  }
};
