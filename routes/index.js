var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var middleware = require("../middleware");
var nodemailer = require('nodemailer');
var mongoose    = require("mongoose");

// Main Route
router.get("/", function(req, res){
    res.render("landing");
});

router.get("/welcome", function(req, res){
    res.render("welcome",{pageTitle: "welcome"});
});

router.get("/projectoverview", function(req, res){
    res.render("projectoverview",{pageTitle: "project"});
});

router.get("/projectfigures", function(req, res){
    res.render("projectfigures",{pageTitle: "project"});
});

router.get("/team", function(req, res){
    res.render("team",{pageTitle: "project"});
});

router.get("/information", function(req, res){
    res.render("information",{pageTitle: "forschools"});
});

router.get("/getinvolved", function(req, res){
    res.render("getinvolved",{pageTitle: "getinvolved"});
});

router.get("/infomaterial", function(req, res){
    res.render("infomaterial",{pageTitle: "infomaterial"});
});

router.get("/partner", function(req, res){
    res.render("partner",{pageTitle: "partner"});
});
// contact form
router.get("/contact", function(req, res){
    res.render("contact",{pageTitle: "contact"});
});
//send mail
router.post("/contact", function(req,res){
    var newMailing = {firstname: req.body.name, lastname: req.body.surname, email: req.body.email, request: req.body.need, message: req.body.message};
    console.log(newMailing);
    
    // Create a SMTP transporter object - to be replaced by real creds
    // dummy - https://mailtrap.io/inboxes
    var transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "83e0e9b6e56230",
          pass: "6c2b02f2359752"
        }
      });

    // Message object
    let message = {
        from: newMailing["firstname"] +' '+ newMailing["lastname"] + '<'+newMailing["email"]+'>',

        // Comma separated list of recipients
        to: 'Teresa Fritsch <mintegration@biodidaktik.uni-halle.de>',
        // bcc: '',

        // Subject of the message
        subject: newMailing["request"],

        // plaintext body
        text: newMailing["message"],

        // HTML body
        // html:
        //     '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>' +
        //     '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>',
    };
    console.log(message)
    

    transporter.sendMail(message, function(error, info){
            if (error) {
                req.flash("error", "Da ist etwas schiefgelaufen, bitte probiere es später wieder.")
                console.log('Email not sent: ' + error);
                res.redirect("/contact");
            } else {
                req.flash("success", "Danke für Ihre Kontaktaufnahme, " + newMailing["firstname"] +' '+ newMailing["lastname"] + ", wir melden uns sobald wie möglich!")
                console.log('Email sent: ' + info.response);
                res.redirect("/welcome");
            }
    });
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
    res.render("register", {pageTitle: "register"})
    mongoose.connect("mongodb://maxisses:051213@mongodb:27017/submissions").then(() => {
        console.log('successfully connected to the local database');
    }).catch(err => {
        console.log('--- error connecting to container database; are you running with docker compose? ---');
        // process.exit()
    });

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
    res.render("login", {pageTitle: "login"});
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