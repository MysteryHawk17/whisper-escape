const mongoose=require("mongoose")


const messageSchema=mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        required:true,
        trim:true
    },
    chatBelong:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat"
    }
},
{
    timestamps:true
}
)


const Message=mongoose.model("Message",messageSchema)


module.exports=Message