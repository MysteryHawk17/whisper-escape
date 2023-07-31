const express=require("express")
const app=express();
const port=process.env.PORT||5000
const connectDB=require("./db/connect")
const cors=require('cors')
const bodyParser=require("body-parser")


//routes import
const authRoutes=require("./routes/authRoutes")
const userRoutes=require("./routes/userRoutes")
const chatRoutes=require("./routes/chatRoutes")
const messageRoutes=require("./routes/messageRoutes");
//middlewares import
app.use(cors({
    origin:["http://localhost:3000","https://whisperscape.vercel.app","https://whisper-escape-t3v5-git-main-mysteryhawk17.vercel.app","https://whisper-escape-t3v5-mysteryhawk17.vercel.app"]
}))
app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));



//routes import 
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/chats",chatRoutes);
app.use("/api/message",messageRoutes)


//default server route
app.get("/",(req,res)=>{
    res.status(200).json({message:"Chat server is working perfectly."})
})



//db connect

connectDB();


//listening to server

app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`)
})





