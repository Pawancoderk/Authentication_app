
import User from "../models/User.model.js"
import crypto from "crypto"
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken";
import { use } from "react";
const registerUser = async (req, res) => {


  // get data 
  const { name, email, password } = req.body;
  // validate user
  if (!name || !email || !password) {
    return res.status(400).json({
      // status: false,
      message: "All fields are required "
    })

  }

  // check if user already exists
  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "User already exists with this email"
      })
    }

    // create user in database 
    const newUser = await User.create({
      name,
      email,
      password
    })

    if (!newUser) {
      return res.status(400).json({
        message: "User not registered"
      })
    }
    // create a verification token
    const token = crypto.randomBytes(32).toString("hex")
    // save token in database

    newUser.verificationToken = token;
    await newUser.save()
    // send token by email to user
    // send email


    // Create a transporter for SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAILTRAP_SENDEREMAIL, // sender address
      to: newUser.email,
      subject: "Verify your email", // Subject line
      text: `Please click on the following link:${process.env.BASE_URL}/api/v1/users${token}`

    }
    await transporter.sendMail(mailOptions)

    // send success status to user

    res.status(201).json({
      message: "User Registered Successfully",
      success: true
    })
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "User registration Failed",
      success: false

    })
  }
}

const verifyUser = async (req, res) => {
  // get token form url
  try {
    const { token } = req.params
    // validate
    console.log(token)
    if (!token) {
      return res.status(400).json({
        message: "Invalid token"
      })
    }
    // find user based on token 
    const user = await User.findOne({ verificationToken: token })
    // if not 
    if (!user) {
      return res.status(400).json({
        message: "Invalid token by user"
      })
    }

    // set isVerified field true
    user.isVerified = true
    // remove verification token
    user.verificationToken = null;
    // save 
    await user.save()
    // return response


  } catch (error) {

  }

}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        status: 400
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        message: "Invalid username or password",
        status: 400
      })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch)
    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password",
        status: 400
      })
    }

    const token = jwt.sign(
      {id: user._id},
      "shhh",
      {expiresIn:"24h" }
    )

    const cookieOptions = {
      httpOnly:true,
      secure: true,
      maxAge: 24*60*60*1000
    }
    res.cookie("token",token,cookieOptions)
    res.status(200).json({
      message: "Login Successfully",
      status: true,
      token,
      user:{
        id: user._id,
        name: user.name
      }
    })
  } catch (error) {
    console.error("Login error",error)
    res.status(400).json({
      message: "Login error"
    })
  }
}

export { registerUser, verifyUser, login }