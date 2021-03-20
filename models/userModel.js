const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const shortid = require("shortid")

const userSchema = new mongoose.Schema({

name: {
    type: String,
    max: 20,
    required: true
},
username: {
    type: String,
    unique: true,
    lowercase: true,
    default: shortid()
},
coverImage: {
    type: String
},
profileImage: {
    type: String
},
bio: {
    type: String
},
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre("save", async function(next) {

   
    if (!this.isModified("password")) {
        next()
    }
    let salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPasswords = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}
module.exports = mongoose.model("user", userSchema)
