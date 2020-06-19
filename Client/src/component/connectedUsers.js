import React from 'react'

const ConnectedUsers = ({connectedUsers, userName}) => {
    return (
        connectedUsers !== null ? 
        <div className="ui list">
            <h5>Connected Users</h5>
            {connectedUsers.map((u, key) => {
                if(u.name === userName){
                    return null;
                }else {
                    return (
                        <div className="item" key={key}>
                            <i style={{color:"#0FB91F"}} className="circle icon"></i>
                            <div className="content">{u.name}</div>
                        </div>
                    )
                }
                
            })}
            
            
        </div> :
        null
    )
}

export default ConnectedUsers
