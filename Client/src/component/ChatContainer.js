import React, { Component } from 'react';
import socket from '../utils/socketConn';
import {PRIVATE_MESSAGE, SENT_MESSAGE, MESSAGE_RECIEVED, CONNECTED_USERS, GROUP_MESSAGE} from '../Event';
import SideBar from './SideBar';
import Messages from './Messages';
import MessageInput from './MessageInput';
import MessageHeader from './MessageHeader';
import ConnectedUsers from './connectedUsers';

export default class ChatContainer extends Component {
    constructor(props){
        super(props);
        this.state={
            chats:[],
            activeChat:null,
            activeChatName:'',
            connectedUsers:null
        }
    }

    componentWillMount(){
        this.setState({chats:this.props.user.chats});
    }

    componentDidMount(){
        console.log(this.state.chats)
        this.state.chats.map(c => {
            return this.setChat(c)
        });
        socket.on(CONNECTED_USERS, (users)=>{
            this.setState({connectedUsers:users})
        });

        socket.on(GROUP_MESSAGE,(chat)=>{
            this.setState({chats:[chat, ...this.state.chats]})
            this.setChat(chat)
        });

        socket.on(PRIVATE_MESSAGE,(chat)=>{
            console.log(chat);
            let chatIsInChats = this.state.chats.find((c)=>c.chatId === chat.chatId)
            if(chatIsInChats){
                return null;
            }
            this.setState({chats:[chat, ...this.state.chats]})
            this.setChat(chat)
        });
    }

    setChat = (chat) => {
        socket.on(`${MESSAGE_RECIEVED}-${chat.chatId}`, this.setMessage(chat))
    }

    setMessage = (chat) => {
        return (message) => {
            let newChats = this.state.chats.map((c)=>{
                if(c._id === chat._id){
                    c.messages = [message , ...c.messages]
                }
                return c;
            })

            this.setState({chats:newChats})
        }
    }

    onSendPrivateMessage = (reciever) => {
        socket.emit(PRIVATE_MESSAGE, {reciever, sender:this.props.user}, ({error, user})=>{
            if(error){
                alert(error);
            }
        })
    } 

    setActiveChat = (chat) => {
        this.setState({activeChat:chat})
    }

    onMessageSent = (message) => {
        const reciever = this.state.activeChat.users.find((u)=> u.name !==this.props.user.name )
        socket.emit(SENT_MESSAGE, {message, chatId:this.state.activeChat.chatId, sender:this.props.user, reciever})
    }

    setActiveChatName = (name) => {
        this.setState({activeChatName: name})
    }

    removeChat = (chatId) => {
        let newChat = this.state.chats.filter(c => c._id !== chatId)
        this.setState({chats:newChat});
    }

    render() {
        return (
            <div className="ui grid"  style={{margin:'10px'}}>
                <div className="five wide column">
                    <SideBar 
                        chats={this.state.chats}
                        activeChat={this.state.activeChat}
                        setActiveChat= {this.setActiveChat}
                        logout={this.props.logOut}
                        user={this.props.user}
                        onSendPrivateMessage={this.onSendPrivateMessage}
                        setActiveChatName = {this.setActiveChatName}
                        removeChatFromList = {this.removeChat}
                    />
                </div>
                <div className="two wide column">
                    <ConnectedUsers 
                        connectedUsers={this.state.connectedUsers}
                        userName = {this.props.user.name}
                    />
                </div>
                 { 
                    this.state.activeChat ? 
                        <div className="nine wide column">
                            <div class="ui top attached header">
                                <MessageHeader activeChatName= {this.state.activeChatName}/>
                            </div>
                            <div className="ui attached header">
                                <MessageInput 
                                    activeChat={this.state.activeChat}
                                    onMessageSent={this.onMessageSent}
                                />
                            </div>
                            <div className="ui bottom attached header">
                            
                                <Messages 
                                    messages = {this.state.activeChat.messages}
                                    type={this.state.activeChat.type}
                                    user={this.props.user}
                                    />
                            </div>
                            
                            
                            
                         </div> :
                        <h5>Select the chat</h5>
                    }
                    
               
            </div>
        )
    }
}

