const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Creating game schema in database
const gameSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questions: [
      {
        equation: String,
        correctAnswer: Number,
        selectedAnswer: Number,
        isCorrect: Boolean,
      },
    ],
  },
  {
    collection: "game",
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model("Game", gameResultSchema);
