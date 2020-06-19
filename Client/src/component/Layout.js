import React,{useState, useRef} from 'react';
import socket from '../utils/socketConn';
import ChatContainer from './ChatContainer';
import Login from './Login';
import {USER_CONNECTED, LOG_OUT} from '../Event';

const Layout = () => {
    const [user, setUserer] = useState(null);

    const initSocket = () => {
        socket.on('connect', ()=> {
            console.log('Connected !');
        })
    }

    const willMount = useRef(true);
    if(willMount.current){
        initSocket();
        willMount.current = false;
    }

    const setUserfunc = (user) => {
        setUserer(user);
        socket.emit(USER_CONNECTED, user);
    }

    const logOut = () => {
        setUserer(null);
        socket.emit(LOG_OUT)
    }
    
    return (
        <div>
            {!user ? 
                <Login setUser={setUserfunc}/> : 
                <ChatContainer user={user} logOut={logOut}/>
            }
        </div>
    )
}

export default Layout
