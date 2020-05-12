var mongoose = require("mongoose");

var teamSchema = new mongoose.Schema({
    name: String,
    members: String,
    image: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Team", teamSchema);
