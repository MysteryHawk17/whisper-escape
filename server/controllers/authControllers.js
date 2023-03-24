const userDB = require("../Models/userModel")
const cloudinary = require("../utils/cloudinary")
const bcrypt = require("bcryptjs")
const jwt=require("jsonwebtoken")
const test = async (req, res) => {
    res.status(200).json({
        message: "Auth Route is working fine"
    })
}

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(200).json({ message: "Fill in the details properly", status: 400 })
    }
    const findUser = await userDB.findOne({ email: email })
    if (findUser) {
        res.status(200).json({ message: "User already exists", status: 500 })
    }
    else {
        let uploadedFile; 
        var fileData = {}
        if (req.file) {
            try {
                uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                    folder: "WhisperScape",
                    resource_type: "image"
                })
            } catch (error) {
                console.log("Error in uploading pizza")
                console.log(error)
                res.status(500).json({ message: "Error in uploading Image" });
            }
            console.log("Uploader pe hai ")
            console.log(uploadedFile)
            fileData = {
                fileName: req.file.originalname,
                filePath: uploadedFile.secure_url,
                fileType: req.file.mimetype,
            }
        }
        const salt = await bcrypt.genSalt(10)
        const newUser = new userDB({
            name: name,
            email: email,
            password: await bcrypt.hash(password, salt),
            image: fileData,
            isAdmin:false
        })
        try {
            console.log("New user save kr diye hai")
            const savedUser = await newUser.save();
            console.log(savedUser)
            res.status(200).json({message:"User saved successfully",status:200})

        } catch (error) {
            console.log("Error in saving user")
            res.status(500).json({message:"Error in saving user",status:500})
        }


    }
}
const loginUser=async(req,res)=>{
    const{email,password}=req.body;
    if(!email||!password){
        res.status(400).json({message:"Fill in the details properly",status:400})
    }
    try {
        const findUser=await userDB.findOne({email:email})
        if(findUser){
            const comparePassword=await bcrypt.compare(password,findUser.password)
            if(comparePassword){
                const token=jwt.sign({
                
                    id:findUser._id,
                },process.env.JWTSECRET,{
                    expiresIn:'30d'
                })
                const { password,createdAt,updatedAt, ...docs } = findUser.toObject();
                console.log(docs)
                res.status(200).json({message:"Successful Login",token:token,user:docs})
            
            }
            else{
                console.log('status wrong')
                res.status(200).json({message:"Password doesnot match",status:400})
            }
        }
        else{
            console.log("user doesnot exist")
            res.status(200).json({message:"User doesnot exist",status:404})
        }
    } catch (error) {
        console.log("error in finding user")
        res.status(500).json({message:"Error in finding user",status:500})
    }
}
module.exports = { test ,createUser,loginUser}