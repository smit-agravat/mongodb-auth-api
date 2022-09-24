const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken"); 
const { findOne } = require("../models/User");

dotenv.config();

// Register

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJs.AES.encrypt(
    req.body.password, process.env.PASS_KEY).toString(),
  });
  

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }

  return;
});

// Login

router.post('/login', async(req,res)=>{
  try {

    const user = await User.findOne({username: req.body.username});
    !user && res.status(401).json("wrong credentials");

    const hashedPassword = CryptoJs.AES.decrypt(
    user.password, process.env.PASS_KEY)

    const OrignalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

    OrignalPassword !== req.body.password &&
    res.status(401).json("wrong credentials");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY,
      {expiresIn:"3d"}
    );

    const {password, ...others} = user._doc

    res.status(200).json({...others, accessToken});
    
  } catch (error) {
    res.status(500).json(error)
    return;
    
  }
  return;
})

module.exports = router;
