// ====================
// teamS ROUTES
// ====================

const express = require("express");
const router = express.Router({mergeParams: true}); // mergeparams to make sure the ":id" part makes it through
const challenge = require("../models/challenge");
const Team = require("../models/team");
const middleware = require("../middleware"); // index is automatically required
const fileUpload = require('express-fileupload');

// default options for uploading files
router.use(fileUpload());

// CREATE team ROUTE
router.post("/",middleware.isLoggedIn, function(req, res){ // isLoggedIn prevents without login teaming via direct post
   // save image and pass directory on
   /* let teamimage = req.files.teamimage;
   teamimage.mv('public/teamimages/'+teamimage.name, function(err) {
       if (err){
           console.log(err)
           console.log("not uploaded file");
       }else{
           console.log("uploaded file");
       }
   }); */
    //lookup challenge using ID
   challenge.findById(req.params.id, function(err, foundchallenge){
       if(err){
           console.log(err);
           res.redirect("/challenges");
       } else {
        req.flash("success", "Neues Team angelegt");
        // req.body.team.image = '/teamimages/'+teamimage.name
        console.log(req.files)
        Team.create(req.body.team, function(err, team){
           if(err){
               console.log(err);
           } else {
               // add username and id to the particular team "team.author.username" refers to the model
                team.author.id = req.user._id;
                team.author.username = req.user.username;
                team.name = req.body.name;
                team.members = req.body.members;
               // save team
                team.save();
                foundchallenge.team.push(team);
                foundchallenge.save();
                res.redirect('/challenges/' + foundchallenge._id);
           }
        });
       }
   });
   //create new team
   //connect new team to challenge
   //redirect challenge show page
});


//  team EDIT ROUte

/* router.get("/:team_id/edit",middleware.checkteamOwnership, function(req, res){
    team.findById(req.params.team_id, function(err, foundteam){
        if(err){
            res.redirect("back");
        } else {
            res.render("teams/edit", {team: foundteam, challenge_id: req.params.id});
        }
    });
})

// team Update ROUTE
router.put("/:team_id",middleware.checkteamOwnership, function(req,res){
    team.findByIdAndUpdate(req.params.team_id, req.body.team, function(err, updatedteam){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Kommentar angepasst")
            res.redirect("/challenges/" + req.params.id);
        }
    });
})

//Destroy challenge route
router.delete("/:team_id",middleware.checkteamOwnership, function(req, res){
    team.findByIdAndRemove(req.params.team_id, function(err, foundchallenge){
        if(err){
            res.redirect("/challenges/");
        } else {
            req.flash("success", "Kommentar gelöscht")
            res.redirect("/challenges/" + req.params.id);
        }
    });
}); */



module.exports = router;