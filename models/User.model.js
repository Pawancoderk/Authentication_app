import mongoose from "mongoose";

const userScheam = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        
    },
    email:{
        type: String,
        required: true,
        trim: true,
        // validate:{
        //     validater: function(value){
        //         return value.includes("@")
        //     },
        //     message: "Email must contain @"
        // }
    },
    password:{
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters "]
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

userScheam.pre("save", async function(next){
    if(this.isModified("password")){
       this.password = bcrypt.hash(this.password,10)
    }
    next()
})

const User = mongoose.model("User", userScheam)

export default User;