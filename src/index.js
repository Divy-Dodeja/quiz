//Import Required Packages
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDbStore = require("connect-mongodb-session")(session);
const path = require("path");
const multer = require("multer");
const config = require("./config/config");

//Setting up express
app.use(cors());

//Implementing helmet to secure express server
app.use(helmet());

//Storing session in database
const store = new mongoDbStore({
  uri: config.MONGODB_URL,
  collection: "sessions",
});

//Setting disk storage
const storage = multer.diskStorage({
  destination: ".src/public/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//Initialising multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("profileImage");

//Check file type
function checkFileType(file, cb) {
  const fileType = /jpeg|jpg|png/;
  const extName = fileType.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileType.test(file.mimetype);

  if (mimetype && extName) {
    return cb(null, true);
  } else {
    cb("File not Supported");
  }
}

// setting view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: config.SECRET_KEY,
    resave: "false",
    saveUninitialized: false,
    store: store,
  })
);

//Setting up Mongoose
mongoose.connect(config.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//Routes
const userRoutes = require("./routes/user.routes");
const middleware = require("./middlewares/auth");
app.use("*", middleware.checkUser);
app.use("/", userRoutes);

//Server Listening
app.listen(config.PORT, () => {
  console.log(`Server started on port ${config.PORT}`);
});

//Export Server
module.exports = app;
