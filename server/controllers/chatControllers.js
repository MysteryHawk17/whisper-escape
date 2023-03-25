const chatDB=require("../Models/chatsModel")


const test=async(req,res)=>{
    res.status(200).json({message:"Chat routes working fine"})
}




module.exports={test};