const dotenv = require("dotenv");
const path = require("path")

dotenv.config({path:'.env'});

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  SECRET_KEY: process.env.SECRET_KEY,
};
