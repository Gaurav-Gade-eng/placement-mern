const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");


// REGISTER
exports.registerUser = async(req,res)=>{

try{

const {name,email,password} = req.body;

const userExists = await User.findOne({email});

if(userExists)
return res.status(400).json({message:"User already exists"});

const hashed = await bcrypt.hash(password,10);

const user = await User.create({

name,
email,
password:hashed

});

res.json(user);

}catch(err){

res.status(500).json({message:"Server error"});

}

};



// LOGIN
exports.loginUser = async(req,res)=>{

try{

const {email,password} = req.body;

const user = await User.findOne({email});

if(!user)
return res.status(400).json({message:"Invalid credentials"});

const match = await bcrypt.compare(password,user.password);

if(!match)
return res.status(400).json({message:"Invalid credentials"});

const token = jwt.sign(

{id:user._id,role:user.role},

process.env.JWT_SECRET,

{expiresIn:"7d"}

);

res.json({token,user});

}catch(err){

res.status(500).json({message:"Server error"});

}

};




// SEND OTP
exports.forgotPassword = async(req,res)=>{

try{

const {email} = req.body;

const user = await User.findOne({email});

if(!user)
return res.status(404).json({message:"User not found"});

const otp = Math.floor(100000 + Math.random()*900000).toString();

user.otp = otp;

user.otpExpire = Date.now() + 5*60*1000;

await user.save();

await sendEmail(email,otp);

res.json({message:"OTP sent to email"});

}catch(err){

console.log(err);

res.status(500).json({message:"Server error"});

}

};




// RESET PASSWORD
exports.resetPassword = async(req,res)=>{

try{

const {email,otp,password} = req.body;

const user = await User.findOne({email});

if(!user)
return res.status(404).json({message:"User not found"});

if(user.otp !== otp)
return res.status(400).json({message:"Invalid OTP"});

if(user.otpExpire < Date.now())
return res.status(400).json({message:"OTP expired"});

const hashed = await bcrypt.hash(password,10);

user.password = hashed;

user.otp = null;

user.otpExpire = null;

await user.save();

res.json({message:"Password reset successful"});

}catch(err){

res.status(500).json({message:"Server error"});

}



};
console.log("EMAIL:", process.env.EMAIL);
console.log("PASS:", process.env.EMAIL_PASSWORD);