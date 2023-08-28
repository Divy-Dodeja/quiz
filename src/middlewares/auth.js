const jwt = require("jsonwebtoken");
const errorMessage = require("../messages/errorMessage");
const config = require("../config/config");

// verifying jwt (getting current user)
exports.checkUser = (req, res, next) => {
  const accessToken = req.session.accessToken;
  if (accessToken) {
    jwt.verify(accessToken, config.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        res.status(400).json(errorMessage.errorMessage(error, null, null));
        res.locals.user = null;
        next();
      } else {
        res.locals.user = decodedToken;
        next();
      }
    });
  } else {
    res.redirect('/register')
};}
