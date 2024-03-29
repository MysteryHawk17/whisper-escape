const jwt=require("jsonwebtoken")
const userDB=require("../Models/userModel")
require('dotenv').config();

const checkLogin=async(req,res,next)=>{
    var token;
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
        try {
            token=req.headers.authorization.split(' ')[1];
            const decoded= jwt.verify(token,process.env.JWTSECRET);
            const user=await userDB.findById({_id:decoded.id})
            // console.log(user)
            const {password,createdAt,updatedAt,...others}=user._doc;
            req.user=others;
            next();

        } catch (error) {
            
            console.log(error)
            res.status(401).json({message:"User not authorized"})
        }
    }
    else{
        res.status(401).json({message:"User not authorized"})
    }
}
const checkAdmin=async(req,res,next)=>{
    var token 
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            const {password,createdAt,updatedAt,...others}=user._doc;
            req.user=others;
            if(req.user.isAdmin){
                next();
            }
            else{
                res.status(401).json({message: "The user is not an admin"});
            }
        }catch(err){
            res.status(401).json({message: "Unauthorized, token failed"});
        }
    }else{
        res.status(401).json({message: "User not authorized"});
    }
}

module.exports={checkLogin,checkAdmin}