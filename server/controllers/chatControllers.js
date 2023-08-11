const chatDB = require("../Models/chatsModel")
const userDB = require("../Models/userModel")
const response = require("../middlewares/responseMiddleware");
const asynchandler = require("express-async-handler");

const test = async (req, res) => {
    response.successResponse(res, '', "Chats routes established");
}

//access chats
const accessChat = asynchandler(async (req, res) => {
    const { userId } = req.body;
    const createrId = req.user._id;
    if (!userId) {
        return response.validationError(res, "Cannot find a chat without the userid");
    }
    const findChat = await chatDB.findOne({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: createrId } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password").populate({
        path: "latestMessage",
        populate: {
            path: "sender"
        }
    })
    if (findChat) {
        return response.successResponse(res, findChat, 'Chat fetched successfully')
    }
    else {
        const newChat = {
            chatName: "sender",
            isGroupChat: false,
            users: [createrId, userId]
        }
        const createdChat = await chatDB.create(newChat);
        if (!createdChat) {
            return response.internalServerError(res, "Failed to start a chat");
        }
        const findChat = await chatDB.findById({ _id: createdChat._id }).populate("users", "-password")
        if (findChat) {
            return response.successResponse(res, findChat, 'Chat created successfully');
        }
        else {
            response.internalServerError(res, 'Failed to fetch chats');
        }
    }
})


//fetch chats

const fetchChats = asynchandler(async (req, res) => {
    const findAllChats = await chatDB.find({
        users: { $elemMatch: { $eq: req.user._id } }
    }).populate("groupAdmin", "-password").populate("users", "-password").populate({
        path: "latestMessage",
        populate: {
            path: "sender"
        }
    }).sort({ updatedAt: -1 })
    if (!findAllChats) {
        return response.internalServerError(res, 'Cannot find the chats')
    }
    response.successResponse(res, findAllChats, "Found the chats successfully");
})

//create group


const createGroupChat = asynchandler(async (req, res) => {
    const { users, chatName } = req.body;
    if (!users || !chatName) {
        return response.validationError(res, 'Cannot create groupchat without the data');
    }
    // const usersJson = JSON.parse(users);
    users.push(req.user._id);
    const createGroupChat = await chatDB.create({
        chatName: chatName,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user._id
    });
    if (!createGroupChat) {
        return response.internalServerError(res, "Group chat creation failed");
    }
    const findGroupChat = await chatDB.findOne({ _id: createGroupChat._id }).populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!findGroupChat) {
        return response.internalServerError(res, "Cannot fetch the chat ");
    }
    response.successResponse(res, findGroupChat, "Group chat created successfully");

})


//rename group


const renameGroup = asynchandler(async (req, res) => {
    const { chatId, newName } = req.body;
    if (!chatId || !newName) {
        return response.validationError(res, 'Cannot change the name without proper information');
    }
    const findChat = await chatDB.findById({ _id: chatId }).populate("users", "-password").populate("groupAdmin", "-password");
    if (!findChat) {
        return response.notFoundError(res, 'Cannot find the chat.');
    }
    findChat.chatName = newName;
    const savedChat = await findChat.save();
    if (!savedChat) {
        return response.internalServerError(res, 'Cannot update the chat name');
    }
    response.successResponse(res, savedChat, 'Updated the chat name successfully');
})


//add to group


const addPeopleToGroup = asynchandler(async (req, res) => {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
        return response.validationError(res, 'Cannot add person without the id');
    }
    const findChat = await chatDB.findById({ _id: chatId });
    if (!findChat) {
        return response.notFoundError(res, 'Cannot find the chat');
    }
    const id = req.user._id;
    if (findChat.groupAdmin.toString() !== id.toString()) {
        return response.errorResponse(res, 'Only admin can add to group', 402)
    }
    if (findChat.users.includes(userId)) {
        return response.errorResponse(res, 'User already exists in the group', 401);
    }
    const updatedChat = await chatDB.findByIdAndUpdate({ _id: chatId }, {
        $push: { users: userId }
    }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");
    if (!updatedChat) {
        return response.internalServerError(res, "Failed to add to group");
    }
    response.successResponse(res, updatedChat, 'Added to the group successfully');
})


//group remove / exit


const removePeople = asynchandler(async (req, res) => {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
        return response.validationError(res, 'Cannot remove person without the id');
    }
    const findChat = await chatDB.findById({ _id: chatId });
    if (!findChat) {
        return response.notFoundError(res, 'Cannot find the chat');
    }
    const id = req.user._id;
    // if (findChat.groupAdmin.toString() !== id.toString() && id !== userId) {
    //     return response.errorResponse(res, 'Only admin or the user itself can remove from group', 402)
    // }
    // if (!findChat.users.includes(userId)) {
    //     return response.errorResponse(res, 'User does not exists in the group', 401);
    // }
    const updatedChat = await chatDB.findByIdAndUpdate({ _id: chatId }, {
        $pull: { users: userId }
    }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");
    if (!updatedChat) {
        return response.internalServerError(res, "Failed to add to group");
    }
    response.successResponse(res, updatedChat, 'Added to the group successfully');

})





module.exports = { test, accessChat, fetchChats, createGroupChat, renameGroup, addPeopleToGroup ,removePeople};