const userDB=require("../Models/userModel")

const test=(req,res)=>{
    res.status(200).json({message:"User route working fine."})
}

const getUser=async(req,res)=>{
    const keyword=req.query.search ? {
        $or:[
                {name:{$regex:req.query.search,$options:"i"}},
                {email:{$regex:req.query.search,$options:"i"}},
                // {content:{$regex:req.query.search,$options:"i"}}
            ]
    }
    :{};
    try {
        const users=await userDB.find(keyword).find({_id:{$ne:req.user._id}})
        res.status(200).json({message:"Users found",users,status:200})
    } catch (error) {
        res.status(500).json({message:"Error in finding users"})
        console.log(error);
    } 
    
    
    console.log(keyword)
}

module.exports={test,getUser};