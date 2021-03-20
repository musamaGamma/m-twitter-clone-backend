const jwt = require("jsonwebtoken")

module.exports = function(req, res, next)  {
    console.log(req.body, "dsds")
    const token = req.header("x-auth-token")
    if(!token) return res.status(401).json({msg: "no token, not authorized"})
   
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.user
        next()
    } catch (error) {
        console.log(error.status)
        res.status(401).json({msg: error.message})
        
    }
    
}