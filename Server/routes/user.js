const User = require('../models/user');

const Register =async (formData) => {
    try {
        console.log(formData);
        const {email} = formData;
        let user = await User.findOne({email}).select('name email profilePic');
        if(user){
            return {error :'Have a user for this email'}
        }
        user = new User(formData);
        await user.save();
        return {user};
    } catch (err) {
        console.log(err.message);
    }
}

const Login = async (formData) => {
    try {
        const {password, email} = formData;
        const user = await User.findOne({email});
        if(!user){
            return {error:'Invalid credential'};
        }
        if(password === user.password){
            return {user};
        }else{
            return {error: 'Password dont correct'};
        }
    } catch (err) {
        console.log(err.message);
    }
}

const addChatSender = async ({chatId, chatName, user, users, type}) => {
    try {
        let userr = await User.findById(user)
        if(!userr){
                return {error:'Something went wrong'} ;
        }
        let chat =  userr.chats.find((c)=> c.chatId === chatId)
        if(!chat){
            userr.chats.unshift({chatId, chatName, users, type})
            await userr.save();
            return {chatSender: userr.chats.find(c => c.chatId === chatId)};
        }
        return {chatSender: userr.chats.find(c => c.chatId === chatId)};
    } catch (err) {
        console.log(err.message);
    }
}

const addChatReciever = async ({chatId, chatName, user, users, type}) => {
    try {
        let userr = await User.findById(user)
        if(!userr){
                return {error:'Something went wrong'} ;
        }
        let chat =  userr.chats.find((c)=> c.chatId === chatId)
        if(!chat){
            console.log(chat);
            userr.chats.unshift({chatId, chatName, users, type })
            await userr.save();
            return {chatReciever: userr.chats.find(c => c.chatId === chatId)};
        }
        return {chatReciever: userr.chats.find(c => c.chatId === chatId)};
    } catch (err) {
        console.log(err.message);
    }
}

const addGroupChat =async ({adminId, chatId, chatName, users, type, userId}) => {
    try {
        let userr = await User.findById(userId);
        if(!userr){
            return {error:'Something went wrong'} ;
        }
        let chat =  userr.chats.find((c)=> c.chatId === chatId)
        if(!chat){
            userr.chats.unshift({chatId, chatName, users, adminId, type})
            await userr.save();
            return {chatCreater: userr.chats.find(c => c.chatId === chatId)};
        }
        return {chatCreater: userr.chats.findOne(c => c.chatId === chatId)};
    } catch (err) {
        console.log(err.message);
    }
}

const addMessage = async ({message, senderId, sender, chatId}) => {
    try {
        const user = await User.findById(senderId);
        if(!user){
            return {error:'No user '}
        }
        let chat = user.chats.find(chat => chat.chatId === chatId);
        
        chat.messages.unshift({message, senderId, sender});
        await user.save();
        return {user};
        
    } catch (err) {
        console.log(err.message);
    }
}

const getUserById =async (id) => {
    try {
        const user= await User.findById(id).select('name email profilePic')
        if(!user){
            return {error:'There is no user'}
        }
        return {user}
    } catch (err) {
        console.log(err.message)
    }
}

const getAllUsers =async (userId) => {
    try {
        const users = await User.find().select('name email');
        const otherUsers = users.filter(user => user.id !== userId)
        if(!otherUsers){
            return {error:'There is no users'}
        }
        return {users:otherUsers};
        
    } catch (err) {
        console.log(err.message);
    }
}

const getUserByName = async (userName) => {
    try {
        const user = await User.findOne({name: userName}).select("id name email profilePic")
        if(!user){
            return {error: 'No user'}
        }
        return {user};
    } catch (err) {
        console.log(err.message);
    }
}

const deleteChat = async (userId, chatId) => {
    try {
        let user = await User.findById(userId);
        if(!user){
            return {error:'No user for this id'}
        }
        const index = user.chats.map(c => c.id).indexOf(chatId);
        user.chats.splice(index, 1);
        user.save();
        return {user}
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = {
    Register, 
    Login, 
    addChatSender, 
    addChatReciever, 
    addMessage, 
    getUserById, 
    getAllUsers,
    addGroupChat,
    getUserByName,
    deleteChat
}