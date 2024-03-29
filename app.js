//jshint esversion:6

require("dotenv").config();
// const md5 = require("md5");
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(
  express.urlencoded({
    extended: true,
  })
);

mongoose
  .connect(
    "mongodb+srv://niloy:nick64569@cluster0.puscjdd.mongodb.net/authentication?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Database Connected");
  });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ["password"],
// });

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      // Store hash in your password DB.
      const newUser = new User({
        email: req.body.username,
        password: hash,
      });
      newUser.save((err) => {
        if (err) {
          console.log(err);
        } else {
          res.render("secrets");
        }
      });
    });
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const pass = req.body.password;
  User.findOne({ email: username }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(pass, foundUser.password, function (err, result) {
          if (result) {
            res.render("secrets");
          }
        });
      }
    }
  });
});

app.listen(3000, () => {
  console.log("Server Running");
});
