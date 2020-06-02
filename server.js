const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const passport  = require('passport');
const session = require('express-session');
const flash = require("connect-flash");
require("./config/passport")(passport)

mongoose.connect(
 "mongodb+srv://nadir:nadir786@cluster0-b2ety.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected To MongoDB")
);

app.set("view engine", "hbs");
//instead of app.engine('handlebars', handlebars({
app.engine(
  "hbs",
  handlebars({
    layoutsDir: __dirname + "/views/layouts",
    //new configuration parameter
    extname: "hbs",
  })
);

app.use(express.urlencoded({ extended: true }));
// Express session
app.use(session({
  secret:'keyboard',
  resave:true,
  saveUninitialized:true,
}))
//Passport initialized
app.use(passport.initialize());
app.use(passport.session());
//Connect flash
app.use(flash());

//Global Variables
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
})
app.use("/", require("./routes/index.js"));
app.use("/users", require("./routes/users.js"));
app.get('*',(req,res)=>{
  res.render("welcome");
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Server Running At Port 3000"));
