const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    name: {
        type: String,
        required: true
    },
    coverImage: {
        type: String
    },
    profileImage: {
        type: String
    },
    bio: {
        type: String
    }
})

profileSchema.virtual("username").get(function() {
    if(this.name) return this.name + "123456"
})
module.exports = mongoose.model("profile", profileSchema)