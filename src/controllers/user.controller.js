const userModel = require("../models/user.model");
const gameModel = require("../models/game.model");
const errorMessage = require("../messages/errorMessage");
const Joi = require("joi");

//Joi validation schema
const userSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .required()
    .regex(/^[a-zA-Z]+$/),
  lastName: Joi.string()
    .trim()
    .required()
    .regex(/^[a-zA-Z]+$/),
  email: Joi.string().email().required(),
  birthDate: Joi.date().iso().required(),
  phoneNumber: Joi.string()
    .pattern(/^\d{3}-\d{3}-\d{4}$/)
    .required(),
  password: Joi.string().min(8).required(),
});

//Register a user

exports.getSignup = async (req, res) => {
  res.render("form", {
    pageTitle: "Register",
  });
};

exports.postSignup = async (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const alert = error.details.map((detail) => detail.message);
    return res.render("form", { pageTitle: "Register", alert: alert });
  } else {
    const email = req.body.email;
    //Checking if user exists
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.render("form", {
        pageTitle: "Register",
        alert: ["User already exists"],
      });
    }
    // Adding user to database
    try {
      const user = await userModel.create({
        name: req.body.firstName + " " + req.body.lastName,
        profileImage: req.file.path,
        email: req.body.email,
        birthDate: new Date(req.body.birthDate),
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
      });
      //Generating jwt after signup and saving it inside session
      req.session.accessToken = user.generateJwt();
      return res.redirect("/home");
    } catch (error) {
      res.status(400).json(errorMessage.errorMessage(error, null, null));
    }
  }
};

//login

exports.getLogin = async (req, res) => {
  res.render("form", { pageTitle: "Login" });
};

exports.postLogin = async (req, res, next) => {
  try {
    // email and password should not be empty
    if (!(req.body.email && req.body.password)) {
      return res.render("form", {
        pageTitle: "Login",
        alert: ["Email and Password are required"],
      });
    }
    const email = req.body.email;
    const password = req.body.password;
    const user = await userModel.findOne({ email });
    //Checking user credentials
    if (!user) {
      return res.render("form", {
        pageTitle: "Login",
        alert: ["Invalid Credentials"],
      });
    }
    //Comparing password
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.render("form", {
        pageTitle: "Login",
        alert: ["Invalid Credentials"],
      });
    }
    //Generating jwt after login and saving it inside session
    req.session.accessToken = user.generateJwt();
    return res.redirect("/home");
  } catch (error) {
    res.status(400).json(errorMessage.errorMessage(error, null, null));
  }
};

exports.getHome = async (req, res) => {
  const userData = res.locals.user;
  try {
    const user = await userModel.findOne({ email: userData.email });
    const profileImage = user.profileImage.replace(/\\/g,'/');
    const gameExist = await gameModel.findOne({ user: userData.id });
    if (gameExist) {
      const deletedDocument = await gameModel.findOneAndDelete({
        user: userData.id,
      });
    }
    userData.birthDate = userData.birthDate.substring(0, 10);
    res.render("home", {
      pageTitle: "Home",
      user: userData,
      profileImage: user.profileImage,
    });
  } catch (error) {
    res.status(400).json(errorMessage.errorMessage(error, null, null));
  }
};

//logout
exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(400).json(errorMessage.errorMessage(error, null, null));
    }
    req.session = null;
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
};
