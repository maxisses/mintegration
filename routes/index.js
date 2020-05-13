var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var middleware = require("../middleware");

// Main Route
router.get("/", function(req, res){
    res.render("landing");
});

router.get("/welcome", function(req, res){
    console.log(req.user);
          res.render("welcome",{pageTitle: "welcome"});
});

router.get("/projectoverview", function(req, res){
    console.log(req.user);
          res.render("projectoverview",{pageTitle: "project"});
});

router.get("/projectfigures", function(req, res){
    console.log(req.user);
          res.render("projectfigures",{pageTitle: "project"});
});

router.get("/team", function(req, res){
    console.log(req.user);
          res.render("team",{pageTitle: "project"});
});

router.get("/information", function(req, res){
    console.log(req.user);
          res.render("information",{pageTitle: "forschools"});
});

router.get("/getinvolved", function(req, res){
    console.log(req.user);
          res.render("getinvolved",{pageTitle: "getinvolved"});
});

router.get("/infomaterial", function(req, res){
    console.log(req.user);
          res.render("infomaterial",{pageTitle: "infomaterial"});
});

router.get("/partner", function(req, res){
    console.log(req.user);
          res.render("partner",{pageTitle: "partner"});
});

router.get("/contact", function(req, res){
    console.log(req.user);
          res.render("contactform/index",{pageTitle: "contact"});
});

router.get("/impressum", function(req, res){
    console.log(req.user);
          res.render("impressum",{pageTitle: "impressum"});
});


//========================
// AUTH Routes
//========================


//register form
router.get("/register", function(req, res){
    res.render("register")
});


// register logic
router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username, orga: req.body.orga, firstname: req.body.firstname, lastname: req.body.lastname});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message)
            return res.render("register");
        }
        // direct login (ofc optional - could also redirect to a login form)
        passport.authenticate("local")(req,res, function(){
            req.flash("success", "Willkommen " + user.username + ", deine Registrierung war erfolgreich")
            res.redirect("/welcome");
        });
    });
});

// show login form
router.get("/login", function(req,res){
    res.render("login");
});

// login logic with the "authenticate" middleware
router.post("/login", passport.authenticate("local", 
        {
            successRedirect: "/welcome",
            failureRedirect: "/login"
        }), function(req,res){

});


// logout route

router.get("/logout", function(req, res){
    // comes with passport
    req.flash("success", "Tschau!")
    req.logout();
    res.redirect("/welcome");
})

router.get("/healthz", function(req, res){
    // comes with passport
    res.writeHead(200);
})

module.exports = router;