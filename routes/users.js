const express = require("express");
const router = express.Router();
const User = require("../modals/User");
const bcrypt = require("bcrypt");
const passport = require('passport')
const {ensureNotAuthenticated} = require('../config/auth')
router.get("/register", ensureNotAuthenticated,(req, res) => {
  res.render("registration");
});
router.get("/login", ensureNotAuthenticated,(req, res) => {
  res.render("login");
});
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please Fullfill all the parts" });
  }
  if (password !== password2) {
    errors.push({ msg: "Password did not matches" });
  }
  if (password.length < 6) {
    errors.push({ msg: "Password must be atleast 4t least 6 digits" });
  }
  if (errors.length > 0) {
    res.render("registration", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already Exists" });
        res.render("registration", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can login"
                );
                res.redirect("/users/login");
              })
              .catch((err) => {
                console.log(err);
              });
          });
        });
      }
    });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

//HANDLE LOGOUT
router.get('/logout',(req,res)=>{
  req.logout();
  req.flash('sucess_msg','you are now logged out');
  res.redirect("/users/login")
})
module.exports = router;
