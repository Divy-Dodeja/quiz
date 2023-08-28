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
const config = require("./config/config");

//Setting up express
app.use(cors({origin: '*'}));

//Implementing helmet to secure express server
app.use(helmet({contentSecurityPolicy: false}));

//Storing session in database
const store = new mongoDbStore({
  uri: config.MONGODB_URL,
  collection: "sessions",
});

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
const gameRoutes = require("./routes/game.routes");
app.use("/", userRoutes);
app.use("/", gameRoutes);

//Server Listening
app.listen(config.PORT, () => {
  console.log(`Server started on port ${config.PORT}`);
});

//Export Server
module.exports = app;
