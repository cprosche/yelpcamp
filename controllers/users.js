const passport = require("passport")
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const ex = module.exports;

ex.renderRegistration = (req, res) => {
    res.render("users/register");
}

ex.registerUser = catchAsync(async (req, res) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username})
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);   
            req.flash("success", "Welcome to YelpCamp");
            res.redirect("/campgrounds");
        });
        
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/register");
    }
})

ex.renderLogin = (req, res) => {
    res.render("users/login");
}

ex.login = (req, res) => {
    req.flash("success", "Welcome back!")
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

ex.logout = (req, res) => {
    req.logout();
    req.flash("success", "Logged you out.")
    res.redirect("/campgrounds"); 
}