const router = require("express").Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const { check, validationResult } = require("express-validator");

//register user
router.post(
  "/users",
  [check("name", "Name field is required").not().isEmpty().isLength({max: 20}).withMessage("Names can't be more than 20 characters"),
   check("email", "Please enter a valid email").isEmail(),
   check("password", "Please enter a password with 6 or more characters").isLength({min: 6})
],
  async (req, res) => {
    const { name, email, password } = req.body;
    const errors = validationResult(req);
    try {

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    
       let user = await User.findOne({email})
       if(user)  return res.status(400).json({errors: [{msg: "user is already registered"}]})
     
      user = await User.create({
        name,
        email,
        password,
      });

      //create and send token
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
        console.log(error)
      res.json(error.message);
    }
  }
);

router.put("/profile", auth, async (req, res) => {
  console.log("does it reach");
  console.log(req.user.id);
  try {
    const user = await User.findById(req.user.id);
    console.log({ user });
    user.name = user.name ? user.name : req.body.name;
    user.profileImage = req.body.profileImage;
    user.coverImage = req.body.coverImage;
    user.bio = req.body.bio;
    await user.save();
    console.log({ user });
    res.json(user);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/profile", auth, async (req, res) => {
  try {
    const profile = await User.findById(req.user.id).select("-password");
    res.json(profile);
  } catch (error) {
    res.send(error.message);
  }
});
//test route get all users
router.get("/users", async (req, res) => {
  try {
    let users = await User.find({});
    res.json(users);
  } catch (error) {
    throw new Error(error.message);
  }
});

router.delete("/users/delete", async (req, res) => {
  try {
    const users = await User.deleteMany({});
    res.json(users);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
