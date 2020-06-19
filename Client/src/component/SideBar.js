import React,{useState} from 'react'
import { Link } from 'react-router-dom';
import socket from '../utils/socketConn';
import {DELETE_CHAT} from '../Event';

const SideBar = ({chats,logout, user, onSendPrivateMessage, setActiveChat, setActiveChatName, removeChatFromList}) => {
    const [reciever, setReciever] = useState('');

    

    const onSubmit = (e) => {
        e.preventDefault();
        onSendPrivateMessage(reciever);
        setName();
    }

    const setName = () => {
        setReciever('');
    }

    const removeChat = (chatId, userId) => {
        socket.emit(DELETE_CHAT, {chatId, userId} ,()=>{
            removeChatFromList(chatId)
        })
    }

    return (
        <div>
            <div style={{marginTop:'10px'}}>
                <form className="ui form" onSubmit={(e)=> onSubmit(e)}>
                    <div className="field">
                        <div className="ui search">
                            <div className="ui icon input">
                                <input 
                                    placeholder="search" 
                                    type="text" 
                                    value={reciever}
                                    onChange={(e)=>setReciever(e.target.value)}
                                />
                                <i className="circular search link icon"></i>
                            </div>
                        </div>
                    </div>
                </form>
                <Link to={`/create-group/${user._id}`}>
                    create group
                </Link>
            </div>
            
            <div className="ui divided items">
                {
                 chats.length > 0 ?  chats.map((chat,key)=> {
                        let anotherUser;
                        let profilePicture ;
                        if(chat.type === 'private'){
                            const userr = chat.users.find((u)=> u.name !== user.name)
                            anotherUser = `${userr.name}(pvivate)`;
                            profilePicture = userr.profilePic;

                        }else {
                            anotherUser = `${chat.chatName}(group)`;
                        }
                        

                    return (
                        <div class="item">
                            <div class="ui tiny image">
                                <img src={profilePicture} />
                            </div>
                            <div class="content">
                                    <div 
                                        style={{cursor:'pointer'}}
                                        key={key} 
                                        class="header"
                                        onClick={()=>{
                                            setActiveChatName(anotherUser)
                                            setActiveChat(chat)
                                            }}>
                                        {anotherUser}
                                    </div>
                                    <div>{chat.messages.length>0 ?  <p>{chat.messages[0].message}</p> : null}</div>            
                            </div>
                            <div 
                                class="right floated content" 
                                style={{cursor:'pointer'}}
                                onClick={()=> removeChat(chat._id, user._id)}>
                                <i class="trash alternate icon" style={{fontSize:25, color:'red'}}></i>
                            </div>
                            
                        </div>
                    )
                    }) :
                    <p>No users yet</p>
                }
            </div>
            <div 
            className="ui negative message"
            onClick={()=> {logout()}}
            style={{cursor:'pointer'}}
            >
                <i className="user times icon"></i>
                <div className="header">{user.name}</div>
                <p   
                title="Logout"
                >
                Logout
                </p>  
            </div>
        </div>
    )
}

export default SideBar
