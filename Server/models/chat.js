const mongoose = require('mongoose');

const Chats = mongoose.Schema({
    messages:[
        {
            message:{
                type:String,
                required:true
            },
            sender:{
                type:String,
                required:true
            }
        }
    ],
    users:[],
    name:{
        type:String,
        required:true
    },
    chatId:{
        type:String,
        required:true
    }
})

module.exports = ChatSchema = mongoose.model('chatSchema', Chats);