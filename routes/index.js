const express = require("express");
const app = express();
const router = express.Router();
const {ensureAuthenticated,ensureNotAuthenticated} = require('../config/auth')
router.get("/", ensureNotAuthenticated,(req, res) => {
  res.render("welcome");
});
router.get("/dashboard",ensureAuthenticated, (req, res) => {
  res.render("dashboard",{username:req.user.name});
});
module.exports = router;
