import mongoose from "mongoose";

const userScheam = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    role:{
        type: String,
        enum:["user","admin"],
        default: "user"
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    verificationToken:{
        type: String
    },
    resetPasswordToken:{
        type: String
    },
    resetPasswordExpiry:{
        type: Date
    }

},{timestamps: true})

const User = mongoose.model("User", userScheam)

export default User;