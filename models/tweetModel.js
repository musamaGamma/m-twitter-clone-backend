const mongoose = require("mongoose")

const tweetSchema = new mongoose.Schema({
    user: {
type: mongoose.Schema.Types.ObjectId,
ref: "user"
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type:String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
     
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            }
        }
    ]
}, {timestamps: true})


module.exports = mongoose.model("tweet", tweetSchema)