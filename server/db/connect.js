require("dotenv").config();
const mongoose=require("mongoose")


mongoose.set("strictQuery",false)
const connectDB=()=>{mongoose.connect(process.env.MONGO_URI).then((e)=>{
    console.log("Connected  to MONGODB Successfully")
}).catch((e)=>{
    console.log("Connection to MONGO DB failed")
    console.log(e);

}) 

}

module.exports=connectDB;



