const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const Users = require("../modals/User");

module.exports = function (passport) {
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      Users.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: "That email is not registered",
            });
          }
          bcrypt.compare(password,user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password Incorrect" });
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (id, done) {
    Users.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
