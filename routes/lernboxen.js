// ====================
// lernboxen Projekt ROUTES
// ====================

var express = require("express");
var router = express.Router({mergeParams: true}); // mergeparams to make sure the any variable parts make it through

router.get("/", function(req, res){
    console.log(req.user);
          res.render("lernboxen",{pageTitle: "lernboxen"});
});

router.get("/sport", function(req, res){
    console.log(req.user);
          res.render("sport",{pageTitle: "lernboxen"});
});

router.get("/vegetation", function(req, res){
    console.log(req.user);
          res.render("vegetation",{pageTitle: "lernboxen"});
});

router.get("/hygiene", function(req, res){
    console.log(req.user);
          res.render("hygiene",{pageTitle: "lernboxen"});
});


module.exports = router;