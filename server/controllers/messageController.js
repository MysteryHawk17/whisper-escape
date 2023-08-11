const chatDB = require("../Models/chatsModel")
const messageDB = require("../Models/messageModel")
const response = require('../middlewares/responseMiddleware');
const asynchandler = require("express-async-handler");


const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Message routes established');
})

//create a message
const createMessage = asynchandler(async (req, res) => {
    const { chatId, content } = req.body;
    console.log(req.body)
    if (!chatId || !content) {
        return response.validationError(res, 'Cannot create a message without the details');
    }
    const sender = req.user._id;
    const newMessage = new messageDB({
        sender: sender,
        chatBelong: chatId,
        content: content
    })
    const savedMessage = await newMessage.save();
    if (!savedMessage) {
        return response.internalServerError(res, "cannot create a message");
    }
    const updateChat = await chatDB.findByIdAndUpdate({ _id: chatId }, {
        latestMessage: savedMessage._id
    }, { new: true });
    const findMessage = await messageDB.findById({ _id: savedMessage._id }).populate("sender", "name image").populate({
        path: "chatBelong",
        populate: {
            path: "users",
            select: "name email image"
        }
    })
    if (!findMessage) {
        return response.internalServerError(res, 'Cannot find the message');
    }
    response.successResponse(res, findMessage, 'message sent successfully');
})


//get all messages
const getAllChatMessages=asynchandler(async(req,res)=>{
    const{chatId}=req.params;
    if(chatId==":chatId"){
        return response.validationError(res,'Cannot find messages without the id');
    }
    const findMessages=await messageDB.find({chatBelong:chatId}).populate("sender","name image").populate({
        path: "chatBelong",
        populate: {
            path: "users",
            select: "name email image"
        }
    })
    if (!findMessages) {
        return response.internalServerError(res, 'Cannot find the message');
    }
    response.successResponse(res, findMessages, 'message fetched successfully');
})



module.exports = { test ,createMessage ,getAllChatMessages }
