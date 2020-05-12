// ====================
// COMMENTS ROUTES
// ====================

var express = require("express");
var router = express.Router({mergeParams: true}); // mergeparams to make sure the ":id" part makes it through
var challenge = require("../models/challenge");
var Comment = require("../models/comment");
var middleware = require("../middleware"); // index is automatically required

// NEW ROUTE
router.get("/new",middleware.isLoggedIn, function(req, res){ // isLoggedIn prevents without login commenting
    // find challenge by id
    challenge.findById(req.params.id, function(err, challenge){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {challenge: challenge});
        }
    })
});

// CREATE COMMENT ROUTE
router.post("/",middleware.isLoggedIn, function(req, res){ // isLoggedIn prevents without login commenting via direct post
   //lookup challenge using ID
   challenge.findById(req.params.id, function(err, foundchallenge){
       if(err){
           console.log(err);
           res.redirect("/challenges");
       } else {
        req.flash("success", "Danke für den Kommentar");
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               // add username and id to the particular comment "comment.author.username" refers to the model
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.time = req.body.time;
               // save comment
               comment.save();
                foundchallenge.comment.push(comment);
                foundchallenge.save();
                console.log(comment);
                res.redirect('/challenges/' + foundchallenge._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to challenge
   //redirect challenge show page
});


//  COMMENT EDIT ROUte

router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {comment: foundComment, challenge_id: req.params.id});
        }
    });
})

// COMMENT Update ROUTE
router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
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
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, foundchallenge){
        if(err){
            res.redirect("/challenges/");
        } else {
            req.flash("success", "Kommentar gelöscht")
            res.redirect("/challenges/" + req.params.id);
        }
    });
});



module.exports = router;