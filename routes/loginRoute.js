const router = require("express").Router()
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const {check, validationResult} = require("express-validator")


// login user
router.post("/",[
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password is required").exists()
], async (req, res)=> {
      

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email, password} = req.body
    //validate
    try {
        console.log(email)
        const user = await User.findOne({email})
      
        if(!user) return res.status(401).json({errors: [{msg: "The email and password you entered did not match our records. Please double-check and try again"}]
        })
        const isMatch = await user.matchPasswords(password)
        if(!isMatch) return res.status(401).json({errors: [{msg: "The email and password you entered did not match our records. Please double-check and try again"}]})
        const payload = {
            user: {
                id: user.id
            }
        }
  
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 36000}, (err, token)=> {
            if(err) throw err
            
            res.json({token})
        })
    } catch (error) {
        console.log(error.message)
        res.json({msg: error.message})
    }
})

module.exports = router