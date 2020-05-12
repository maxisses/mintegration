var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var Challenge  = require("../models/challenge");
var plotly = require('plotly')("maxisses", "vDdJG91O2qeXQupMTk6I");
var middleware = require("../middleware");

// get into watson natural language clf for GoT Special
let NaturalLanguageClassifierV1 = require('watson-developer-cloud/natural-language-classifier/v1');
let naturalLanguageClassifier = new NaturalLanguageClassifierV1({
    iam_apikey: "ME1iSBz_j_rXdCKdFytUzS8dCqokgmeR6G4y5_GQcZAV"
});

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

router.get("/getinvolved", function(req, res){
    console.log(req.user);
          res.render("getinvolved",{pageTitle: "getinvolved"});
});

router.get("/schedule", function(req, res){
    console.log(req.user);
    // Get all challenges from DB
    Challenge.find({}, function(err, allchallenges){
       if(err){
           console.log(err);
       } else {
          res.render("schedule",{Challenges:allchallenges});
       }
    });
});

let predictions = []
let plotmeta = []
router.get("/got", function(req, res){
    res.render("got", {predictions: predictions, plotmeta:plotmeta});
});

router.post("/got",middleware.isLoggedIn, function(req, res){
    let texttoclf = req.body.texttoclf;
    naturalLanguageClassifier.classify({
        text: texttoclf,
        classifier_id: '1da3bfx691-nlc-286' },
        function(err, response) {
        if (err){
            console.log('error:', err);
            let watson = "nothing to display"
        }else{
            let watson = JSON.parse(JSON.stringify(response, null, 2))
            console.log(watson)
            predictions.unshift(watson)
            
            var data = [
                {
                  x: [watson.classes[0].class_name, watson.classes[1].class_name, watson.classes[2].class_name,watson.classes[3].class_name, watson.classes[4].class_name, watson.classes[5].class_name,watson.classes[6].class_name, watson.classes[7].class_name, watson.classes[8].class_name,watson.classes[9].class_name],
                  y: [watson.classes[0].confidence, watson.classes[1].confidence, watson.classes[2].confidence,watson.classes[3].confidence, watson.classes[4].confidence, watson.classes[5].confidence,watson.classes[6].confidence, watson.classes[7].confidence, watson.classes[8].confidence,watson.classes[9].confidence],
                  type: "bar"
                }
                ];

                var layout= {
                    plot_bgcolor:"#e9ecef",
                    paper_bgcolor: "#e9ecef"
                };

                var graphOptions = {layout: layout, filename: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), fileopt: "overwrite"};
                console.log(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
                plotly.plot(data, graphOptions, function (err, msg) {
                    plotmeta.unshift(msg)
                    console.log(msg);
                    
                });
        }
    });
    setTimeout((function() {res.render("got", {predictions:predictions, plotmeta:plotmeta})}), 3500);
});

router.get("/gotgpt2", function(req, res){
    res.render("gotgpt2");
});



//========================
// AUTH Routes are coming here
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
            res.redirect("/challenges");
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
            successRedirect: "/challenges",
            failureRedirect: "/login"
        }), function(req,res){

});


// logout route

router.get("/logout", function(req, res){
    // comes with passport
    req.flash("success", "Tschau!")
    req.logout();
    res.redirect("/challenges");
})

router.get("/healthz", function(req, res){
    // comes with passport
    res.writeHead(200);
})

module.exports = router;