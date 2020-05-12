
// all the middleware goes here

var challenge = require("../models/challenge");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkchallengeOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        challenge.findById(req.params.id, function(err, foundchallenge){
            if(err){
                res.redirect("back");
            } else {
                //does the user own the challenge
                if(foundchallenge.author.id.equals(req.user._id)){ // object id vs string!!!
                    next();
                } else {
                    req.flash("error", "Keine Berechtigung!")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Bitte einloggen!")
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                //does the user own the challenge
                if(foundComment.author.id.equals(req.user._id)){ // object id vs string!!!
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Bitte einloggen!")
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Bitte einloggen!")
    res.redirect("/login");
}

module.exports = middlewareObj;