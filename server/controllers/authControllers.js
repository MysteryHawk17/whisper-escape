const userDB = require("../Models/userModel")
const cloudinary = require("../utils/cloudinary")
const bcrypt = require("bcryptjs")
const jwt = require("../utils/jwt")
const response = require("../middlewares/responseMiddleware")
const asynchandler = require("express-async-handler")
const test = async (req, res) => {
    res.status(200).json({
        message: "Auth Route is working fine"
    })
}

// const createUser = async (req, res) => {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) {
//         res.status(200).json({ message: "Fill in the details properly", status: 400 })
//         return;
//     }
//     const findUser = await userDB.findOne({ email: email })
//     if (findUser) {
//         res.status(200).json({ message: "User already exists", status: 500 })
//     }
//     else {
//         let uploadedFile;
//         var fileData = ''
//         if (req.file) {
//             try {
//                 uploadedFile = await cloudinary.uploader.upload(req.file.path, {
//                     folder: "WhisperScape",
//                     resource_type: "image"
//                 })
//             } catch (error) {
//                 console.log("Error in uploading pizza")
//                 console.log(error)
//                 res.status(500).json({ message: "Error in uploading Image" });
//             }
//             console.log("Uploader pe hai ")
//             console.log(uploadedFile)
//             fileData = uploadedFile.secure_url;
//         }
//         const salt = await bcrypt.genSalt(10)
//         const newUser = new userDB({
//             name: name,
//             email: email,
//             password: await bcrypt.hash(password, salt),
//             image: fileData,
//             isAdmin: false
//         })
//         try {
//             console.log("New user save kr diye hai")
//             const savedUser = await newUser.save();
//             console.log(savedUser)
//             response.successResponse(res, savedUser, "saved user successfully")

//         } catch (error) {
//             console.log("Error in saving user")
//             response.internalServerError(res, 'Error in creating the user');
//         }


//     }
// }

const createUser = asynchandler(async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return response.validationError(res, "Cannot create a user without proper information");
    }
    const findUser = await userDB.findOne({ email: email });
    if (findUser) {
        return response.errorResponse(res, 'User already exists.Login', 401);
    }
    var image = ''
    if (req.file) {
        const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
            folder: "WhisperScape",
        })
        if (uploadedFile) {
            image = uploadedFile.secure_url;
        }
    }
    const newUser = new userDB({
        name: name,
        email: email,
        password: await bcrypt.hash(password, await bcrypt.genSalt(10)),
        image: image,
        isAdmin: false
    })
    const savedUser = await newUser.save();
    if (!savedUser) {
        return response.internalServerError(res, "Failed to save the user");
    }
    const token = jwt(savedUser._id);
    response.successResponse(res, { token: token, user: savedUser }, "Saved the user successfully");
})
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        response.validationError(res, 'Cannot login without proper information');
        return;
    }
    const findUser = await userDB.findOne({ email: email });
    if (!findUser) {
        return response.notFoundError(res, "Cannot find the user");

    }
    const comparePasword = await bcrypt.compare(password, findUser.password);
    if (!comparePasword) {
        return response.errorResponse(res, 'Incorrect password', 401);
    }
    const token = jwt(findUser._id);
    response.successResponse(res, { token: token, user: findUser }, "Login successful");
}
module.exports = { test, createUser, loginUser }