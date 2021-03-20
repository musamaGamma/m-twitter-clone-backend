const router = require("express").Router()
const Tweet = require("../models/tweetModel")
const User = require("../models/userModel")
const auth = require("../middlewares/auth")



//get all tweets
router.get("/tweets", async(req, res)=> {
   try {
          const tweets = await Tweet.find({})
          res.json(tweets)
   } catch (error) {
   res.send(error.message)
   }

})

//get user tweets
router.get("/mytweets",auth, async(req, res)=> {
    try {
        const mytweets = await Tweet.find({user: req.user.id})
        res.json(mytweets)
    } catch (error) {
        res.send(error.message)
    }
})

router.get("/tweets/:id/likes", async(req, res)=> {
    try {
        const tweet =  await Tweet.findById(req.params.id)
        if(!tweet) return res.status(404).json({msg: "tweet not found"})

        res.json(tweet.likes)
    } catch (error) {
        res.send(error)
    }
})
router.post("/tweets",auth,  async (req, res)=> {

    //validate
    try {
        const user = await User.findById(req.user.id).select("-password")
       let tweet =  await Tweet.create({
           user: user.id,
            text: req.body.text,
            name: user.name,
            username: user.username,
            profileImage: user.profileImage
        })
        res.json(tweet)
    } catch (error) {
        res.send(error.message)
    }
})

//like a tweet
router.put("/tweets/:id/like",auth, async(req, res)=> {
    try {
        let tweet = await Tweet.findById(req.params.id)

        if(tweet.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({msg: "post has already been liked"})
        }
        tweet.likes.push({user: req.user.id})

        tweet = await tweet.save()
        res.json(tweet.likes)


        
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})

router.put("/tweets/:id/unlike", auth, async(req, res)=> {
    try {
        let tweet = await Tweet.findById(req.params.id)

        // console.log(arr, req.user.id)
        tweet.likes = tweet.likes.filter(like => {like.user.toString() !== req.user.id})

        tweet = await tweet.save()
        res.json(tweet.likes)
         console.log(tweet)

        
    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
})



// delete all tweets
router.delete("/tweets/deleteall", async(req, res)=> {
    try {
        const success = await Tweet.deleteMany({})
        res.json(success)
    } catch (error) {
        res.send(error.message)
    }
  

})

//delete tweet

router.delete("/tweets/:id", auth, async (req, res)=> {
    try {
        const tweet = await Tweet.findByIdAndDelete(req.params.id)
        res.json(tweet)
    } catch (error) {
        res.send(error.message)
    }
})


module.exports = router