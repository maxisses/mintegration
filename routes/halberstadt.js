// ====================
// Halberstadt Projekt ROUTES
// ====================

var express = require("express");
var router = express.Router({mergeParams: true}); // mergeparams to make sure the any variable parts make it through

router.get("/", function(req, res){
    console.log(req.user);
          res.render("halberstadt",{pageTitle: "forschools"});
});

router.get("/sport", function(req, res){
    console.log(req.user);
          res.render("sport",{pageTitle: "forschools"});
});

router.get("/vegetation", function(req, res){
    console.log(req.user);
          res.render("vegetation",{pageTitle: "forschools"});
});

router.get("/hygiene", function(req, res){
    console.log(req.user);
          res.render("hygiene",{pageTitle: "forschools"});
});


module.exports = router;