import React,{useState, useEffect} from 'react';
import {GROUP_MESSAGE} from '../Event';
import socket from '../utils/socketConn';
import {ALL_USERS} from '../Event';

const Group = ({match}) => {
    const [group, setGroup] = useState('');
    const [userId, setUserId] = useState(null);
    const [allUsers, setAllUsers] = useState(null);
    const [groupMembers, setGroupMembers] = useState([]);

    useEffect(()=>{
        setUserId(match.params.id)
        socket.emit(ALL_USERS, {userId: match.params.id}, (data)=>{
            setAllUsers(data);
        })
    },[])

    const onSubmit = (e) => {
        e.preventDefault();
        socket.emit(GROUP_MESSAGE, ({group, userId, users:groupMembers}));
    }

    return (
        <div style={{padding:'15px'}}>
            <form className="ui form" onSubmit={(e)=> onSubmit(e)}>
                    <div className="field">
                        <div className="ui search">
                            <div className="ui icon input">
                                <input 
                                    placeholder="search" 
                                    type="text" 
                                    value={group}
                                    onChange={(e)=>setGroup(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </form>
                {allUsers ? allUsers.map((user, key) =>{
                    return <h5 onClick={ ()=> setGroupMembers([...groupMembers, user]) }>
                        {user.name}
                    </h5>
                }):
                <h4>Loading...</h4>
            }
        </div>
    )
}

export default Group;
