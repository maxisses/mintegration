// ====================
// challenge ROUTES
// ====================

var express = require("express");
var router = express.Router();
var challenge  = require("../models/challenge");
var middleware = require("../middleware"); // index is automatically required
var fileUpload = require('express-fileupload');

// default options
router.use(fileUpload());


//INDEX - show all challenges
router.get("/", function(req, res){
    console.log(req.user);
    // Get all challenges from DB
    challenge.find({}, function(err, allchallenges){
       if(err){
           console.log(err);
       } else {
          res.render("index",{Challenges:allchallenges});
       }
    });
});

//INDEX - show all challenges
router.get("/newchallenge", function(req, res){
    console.log(req.user);
    // Get all challenges from DB
    challenge.find({}, function(err, allchallenges){
       if(err){
           console.log(err);
       } else {
          res.render("challenges/new",{Challenges:allchallenges});
       }
    });
});

//CREATE - add new challenge to DB
router.post("/newchallenge",middleware.isLoggedIn, function(req, res){
    // get data from form and add to challenges array
    var name = req.body.name;
    var image = req.body.image;
    var userstory = req.body.userstory;
    var empathycard = req.files.empathycard;
    var desc = req.body.description;
    var datastuf = req.body.datastuff;
    var techstuf = req.body.techstuff;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    empathycard.mv('public/empathycards/'+empathycard.name, function(err) {
        if (err){
            console.log(err)
            console.log("not uploaded file");
        }else{
            console.log("uploaded file");
            console.log(empathycard.name);
        }
    });
    var newchallenge = {name: name, userstory: userstory, image: image, empathycard: '/empathycards/'+empathycard.name, techstuf: techstuf, datastuf: datastuf, description: desc, author: author}
    // Create a new challenge and save to DB
    challenge.create(newchallenge, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/challenges");
        }
    });
});

//NEW - show form to create new challenge
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("new"); 
});

// SHOW - shows more info about one challenge
router.get("/:id", function(req, res){
    //find the challenge with provided ID
    challenge.findById(req.params.id).populate('comment').populate('team').exec(function(err, foundchallenge){
        if(err){
            console.log(err);
        } else {
            // console.log(foundchallenge)
            //render show template with that challenge
            res.render("show", {challenge: foundchallenge});
        }
    });
});

// edit challenge route
router.get("/:id/edit", middleware.checkchallengeOwnership, function(req, res){
    // if user is logged in?
        challenge.findById(req.params.id, function(err, foundchallenge){
            res.render("challenges/edit", {challenge: foundchallenge});
    });
});

// update challenge route
router.put("/:id", middleware.checkchallengeOwnership, function(req, res){
    // find and update the correct challenge in the DB // and then redirect
    challenge.findByIdAndUpdate(req.params.id, req.body.challenge, function(err, updatedchallenge){
        if(err){
            req.flash("success", "Da ist was schief gegangen!")
            res.redirect("/challenges");
        } else {
            req.flash("success", "Challenge angepasst")
            res.redirect("/challenges/" + req.params.id);
        }
    });
});

//Destroy challenge route
router.delete("/:id", middleware.checkchallengeOwnership, function(req, res){
    challenge.findByIdAndRemove(req.params.id, function(err, foundchallenge){
        if(err){
            req.flash("success", "Da ist was schiefgegangen!")
            res.redirect("/challenges");
        } else {
            req.flash("success", "Challenge gelöscht")
            res.redirect("/challenges");
        }
    });
});

module.exports = router;
