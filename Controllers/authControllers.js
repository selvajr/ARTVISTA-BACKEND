import User from "../Models/userModel.js";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { admin } from "../Service/nodemailer.js";
dotenv.config();

//register user
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return res.status(400).json({ message: "please fill  out the fields" });
  }
  //checking is user already exists
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }
  //hashing the password

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res
      .status(200)
      .json({ message: "User Registered Successfully", result: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).josn({ message: "SignUp Failure Internal Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return res.status(400).json({ message: "please fill  out the fields" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    const passwordMatch = await bcryptjs.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    //jwt part token creattion after signup

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY
    );

    //console.log(token)
    res
      .status(200)
      .json({ message: "User SignIn Successfully", data: user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "SignIn failure Internal Server Error" });
  }
};

export const google = async (req, res) => {
  const { name, email, profilePic } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      //jwt part token creattion

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET_KEY
      );
      res
        .status(200)
        .json({ message: "User SignIn Successfully", data: user, token });
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email: email,
        password: hashedPassword,
        profilePicture: profilePic,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET_KEY
      );

      res
        .status(200)
        .json({ message: "User SignIn Successfully", data: newUser, token });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Google authentication Failure Internal Server Error" });
  }
};


export const adminverify=async(req,res)=>{
  try {
    const {email}=req.body;
    const user=await User.findOne({email});
    if(!user){
      return res.status(401).json({message:"User Not Found"})
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY
    );
    await admin(user,token,res)
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error in verifing user " });
  }
}

export const adminactivate=async(req,res)=>{

  try {
    const {id,token}=req.params
    const {username,bio,portfolio}=req.body
    const hashed=await jwt.verify(token,process.env.JWT_SECRET_KEY)
    if(!hashed){
      return res.status(400).json({message:"Invalid Token"})
    }
    const user=await User.findByIdAndUpdate(id,{$set:{
username:req.body.username,
bio:req.body.bio,
portfolio:req.body.portfolio

    }},{new:true})
    user.isAdmin=true
    await user.save()
    res.status(200).json({message:'admin loggined successfully',data:user})

  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error in activating admin panel" });
  }
}