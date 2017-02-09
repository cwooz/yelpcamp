var express = require("express"),
    router     = express.Router(),
    passport   = require("passport"),
    User       = require("../models/user");


//ROOT ROUTE= =======================
router.get("/", function(req, res) {
    res.render("landing");
});


//AUTHENTICATION ROUTES======================
//Show Register Form
router.get("/register", function(req, res) {
    res.render("register");
});

//Handle SignUp Logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username + "!");
            res.redirect("/campgrounds");
        });
    });
});


//LOGIN ROUTES============================
//Show Login Form
router.get("/login", function(req, res) {
    res.render("login");
});

//Handle Login Logic
//app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});


//LOGOUT ROUTE============================
router.get("/logout", function(req, res) {
    req.logout();
    //Add username to the end of string....(not yet completed)
    req.flash("success", "Logged you out!");
    res.redirect("/");
});



module.exports = router;