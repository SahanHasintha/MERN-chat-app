const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const {v4}= require('uuid');

const mongoDB = require('./config/mongoDbConnect');
const {
    USER_LOGIN,
    USER_REGISTER, 
    USER_CONNECTED, 
    LOG_OUT, 
    PRIVATE_MESSAGE, 
    SENT_MESSAGE, 
    MESSAGE_RECIEVED,
    CONNECTED_USERS,
    GROUP_MESSAGE,
    ALL_USERS,
    DELETE_CHAT
} = require('../client/src/Event');
const {
    Register, 
    Login, 
    addChatSender, 
    addChatReciever, 
    getUserById,
    addMessage,
    addGroupChat,
    getAllUsers,
    getUserByName,
    deleteChat
} = require('./routes/user');
const {createChat, addMessageToChat} = require('./routes/chats');

mongoDB();

const server = http.createServer(app);
const io = socketio(server);

let connectedUsers = [];

io.on('connect',(socket)=>{
    socket.on(USER_REGISTER,async (formData, callback)=>{
        const {error, user} = await Register(formData);
        if(user){
            callback({user})
        }
        if(error){
            callback({error})
        }
    });

    socket.on(USER_LOGIN,async (formData, callback)=>{
        try {
            const {error, user} = await Login(formData)
            if(error){
                callback({error});
            }
            if(user){
                callback({user});
            }
        } catch (err) {
            console.log(err.message)
        }
        
    })

    socket.on(USER_CONNECTED, (user)=>{
        user.socketId = socket.id;
        socket.user = user;
        connectedUsers = [...connectedUsers, user];
        io.sockets.emit(CONNECTED_USERS, connectedUsers);
        
        
    })

    socket.on(ALL_USERS,async ({userId}, callback)=>{
        const {users, error} = await getAllUsers(userId);
        if(users){
            callback(users);
        }
    })

    socket.on(PRIVATE_MESSAGE, async({reciever, sender}, callback)=>{
        try {
            console.log(sender);
            const {error, user} = await getUserByName(reciever);
            console.log(user);
            let {_id, name, email, profilePic} = sender;
            let senderDetails = {_id, name, email, profilePic}
            if(user){
                const rec = connectedUsers.find((u)=> u._id === user.id);
                let chatId = user.id > sender._id ? `${user.id}-${sender._id}`:`${sender._id}-${user.id}`;
                const {chatSender} = await addChatSender({chatId:chatId, chatName:`${user.name}&${name}`, user:_id, users:[user, senderDetails], type:'private'});
                const {chatReciever} = await addChatReciever({chatId:chatId, chatName:`${user.name}&${name}`,user:user.id, users:[user, senderDetails], type:'private'});
                if(rec){
                    socket.to(rec.socketId).emit(PRIVATE_MESSAGE, chatReciever)
                }

                return socket.emit(PRIVATE_MESSAGE, chatSender)
                
            }else{
                callback({error:'No user for this name'})
            }
        } catch (err) {
            console.log(err.message)
        }
    })

    // socket.on(PRIVATE_MESSAGE,async ({reciever, sender}, callback)=>{
    //     try {
    //         let rec = connectedUsers.filter((user)=> user.name === reciever);
    //         console.log(rec.length);
    //         if(rec.length === 1){
    //             let chatId = rec[0]._id > sender._id ? `${rec[0]._id}-${sender._id}`:`${sender._id}-${rec[0]._id}`;
                    
    //                 const {chatSender} = await addChatSender({chatId:chatId, chatName:`${rec[0].name}&${sender.name}`, user:sender, users:[rec[0], sender], type:'private'});
    //                 const {chatReciever} = await addChatReciever({chatId:chatId, chatName:`${rec[0].name}&${sender.name}`,user:rec[0], users:[rec[0], sender], type:'private'});
    //                 if(chatReciever){
    //                     console.log(chatReciever)
    //                     socket.to(rec[0].socketId).emit(PRIVATE_MESSAGE, chatReciever);
    //                 }
    //                 if(chatSender){
    //                     socket.emit(PRIVATE_MESSAGE, chatSender);
    //                 }
            
    //         }else{
    //             callback({error:'No user for this name'})
    //         }
            
    //     } catch (err) {
    //         console.log(err.message);
    //     }
    // })

    socket.on(GROUP_MESSAGE,async (data)=>{
        let id = v4();
        console.log(data.users);
        const {user, error} = await getUserById(data.userId);
        console.log(data.users);
        console.log('user', user);
        if(user){
            const {chatCreater} = await addGroupChat({adminId:user.id, chatId:id, chatName:data.group, users:[user, ...data.users], type:'group', userId:user.id});
            for(let member of data.users){
                await addGroupChat({adminId:user.id, chatId:id, chatName:data.group, users:[user, ...data.users], type:'group', userId:member._id});
                let u = connectedUsers.find((u)=>u._id === member._id);
                socket.to(u.socketId).emit(GROUP_MESSAGE, chatCreater)
            }
            if(chatCreater){
               return socket.emit(GROUP_MESSAGE, chatCreater);
            }
        }
        if(error){
            console.log(error.message);
        }
        
    })



    socket.on(SENT_MESSAGE,async (data)=>{
        const addMgToSenderData = {message:data.message, chatId:data.chatId,sender:data.sender.name ,senderId:data.sender._id}
        const addMgToRecieverData = {message:data.message, chatId:data.chatId,sender:data.sender.name ,senderId:data.reciever._id}
        try {
            await addMessage(addMgToSenderData);
            await addMessage(addMgToRecieverData)
            io.emit(`${MESSAGE_RECIEVED}-${data.chatId}`,{message:data.message,sender:data.sender.name,chatId:data.chatId})
            
        } catch (err) {
            console.log(err.message)
        }
        
    })

    socket.on('disconnect',()=>{
        if(socket.user){
            const index = connectedUsers.map(user => user.email).indexOf(socket.user.email);
            connectedUsers.splice(index, 1);
        }
    })

    socket.on(LOG_OUT, () => {
        
        const index = connectedUsers.map(user => user.email).indexOf(socket.user.email);
        connectedUsers.splice(index, 1);
    })

    socket.on(DELETE_CHAT,async ({chatId, userId}, callback)=> {
        const {error, user} =  await deleteChat(userId, chatId)
        if(error){
            console.log(error.message);
        }
        if(user){
            callback();
        }
    })
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> {
    console.log('Server connected !');
})