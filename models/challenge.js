var mongoose = require("mongoose");

var ChallengeSchema = new mongoose.Schema({
    name: String,
    userstory: String,
    image: String,
    empathycard: String,
    description: String,
    datastuf: String,
    techstuf: String,
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    team: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team"
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
module.exports = mongoose.model("Challenge", ChallengeSchema);
