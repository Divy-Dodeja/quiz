const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const config = require('../config/config')

//Creating user schema in database
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      require: [true, "Please add a name"],
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      require: [true, "Please add a email"],
    },
    birthDate: {
      type: Date,
      trim: true,
      require: [true, "Please add a birthdate in format YYYY-MM-DD"],
    },
    phoneNumber: {
      type: String,
      trim: true,
      require: [true, "Please add a phone number"],
      maxlength: 16,
    },
    password: {
      type: String,
      trim: true,
      require: [true, "Please add a Password"],
      minlength: [8],
    },
    gameResults: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }]
  },
  {
    collection: "user",
    timestamps: true,
    strict: true,
  }
);

//Encrypting password nefore saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//Verify password
userSchema.methods.comparePassword = async function (yourPassword) {
  return bcrypt.compare(yourPassword, this.password);
};

//Generating JWT
userSchema.methods.generateJwt = function () {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      birthDate: this.birthDate,
      phoneNumber: this.phoneNumber,
    },
    config.SECRET_KEY
  );
};

//Exclude some fields from the response
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  const fieldsToExclude = ["password", "createdAt", "updatedAt", "__v"];
  fieldsToExclude.forEach((field) => delete user[field]);
  return user;
};

module.exports = mongoose.model("User", userSchema);
