const express=require("express")
const app=express();
const port=process.env.PORT||5000
const connectDB=require("./db/connect")
const cors=require('cors')
const bodyParser=require("body-parser")
const authRoutes=require("./routes/authRoutes")
//middlewares import
app.use(cors({
    origin:["http://localhost:3000"]
}))
app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));



//routes import 
app.use("/api/auth",authRoutes);




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





