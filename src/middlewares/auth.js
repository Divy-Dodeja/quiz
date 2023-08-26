const jwt = require("jsonwebtoken");
const errorMessage = require("../messages/errorMessage").errorMessage;

const SECRET_KEY = "secret";

// verifying jwt (getting current user)
exports.checkUser = (req, res, next) => {
  const accessToken = req.session.accessToken;
  if (accessToken) {
    jwt.verify(accessToken, SECRET_KEY, async (err, decodedToken) => {
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
