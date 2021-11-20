const express = require("express");
const router = express.Router();
const passport = require("passport")
const usersConstroller = require("../controllers/users")

router.route("/register")
    .get(usersConstroller.renderRegistration)
    .post(usersConstroller.registerUser)

router.route("/login")
    .get(usersConstroller.renderLogin)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), usersConstroller.login)

router.get("/logout", usersConstroller.logout)

module.exports = router;