const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema(
    {
        sessionId: {
        type: String,
        required: true,
            },
        type:{
            type:String,
            enum:['user','bot'],
            required:true,
        },
        text:{
            type:String,
            required:true,
        },
        timestamp:{type:Date,default:Date.now()}
    }
)
const Message = mongoose.model("Message",messageSchema)
module.exports = Message;

