const Chats = require('../models/chat');

const createChat =async (formData) => {
    try {
        let chat =await Chats.findOne({chatId : formData.chatId})
        if(chat){
            return {chat}
        }
        chat = new Chats(formData);
        await chat.save();
        return {chat};
    } catch (err) {
        console.log(err.message);
    }
    
}

const addMessageToChat = async (data) => {
    const {message, chatId, sender}= data;
    try {
        let chat = await Chats.findById(chatId);
        if(chat){
            const newMessage = {message, sender:sender.name};
            chat.messages.unshift(newMessage);
            await chat.save();
            return {newMessage};
        }else{
            return {error:'No chat'};
        }
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = {createChat, addMessageToChat}