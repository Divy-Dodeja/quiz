const jwt = require("jsonwebtoken");
const errorMessage = require("../messages/errorMessage").errorMessage;
const config = require("../config/config")

// verifying jwt (getting current user)
exports.checkUser = (req, res, next) => {
  const accessToken = req.session.accessToken;
  if (accessToken) {
    jwt.verify(accessToken, config.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.locals.user = null;
        next();
      } else {
        res.locals.user = decodedToken;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
