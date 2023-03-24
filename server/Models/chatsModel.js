//chatName
//isGroupChat
//users
//latestMessages
//groupAdmin

const mongoose = require("mongoose")
const chatSchema = mongoose.Schema({
    chatName: {
        type: String,
        required: true
    },
    isGroupChat: {
        type: Boolean,
        required: true
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

},{
    timestamps:true
})

const Chats=mongoose.model("Chat",chatSchema)

module.exports=Chats