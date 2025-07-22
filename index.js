import express from "express"
import dotenv from 'dotenv'
import cors from "cors"
import dbConnect from "./utils/db.js"
import userRouter from "./routes/user.routes.js"

dotenv.config()

const app = express();

app.use(cors({
    origin: process.env.BASE_URL,
    methods: ["POST","GET","DELETE","PUT"],
    allowedHeaders: ["Content-Type","Authorization"],
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
const port = process.env.PORT || 4000

app.get("/",(req,res)=>{
    res.send("hello")
})

dbConnect()

app.use("/api/v1/users",userRouter)

app.listen(process.env.PORT,()=>{
    console.log(`App listening on port ${process.env.PORT}`)
})