import mongoose from "mongoose";

const dbConnect = ()=>{
    const db = mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("Connected to mongodb")
    })
    .catch(()=>{
        console.log("Error connecting to mongodb")
    })
}

export default dbConnect