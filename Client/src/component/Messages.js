import React from 'react'

const Messages = ({messages, user, type}) => {
    return (
        type === 'private' ? 
        <div>
            {messages ? messages.map((msg, key) => <div style={{marginTop:'10px'}} key={key}>
                {msg.sender === user.name ? <div className="ui right aligned grid">
                        <div className="column">
                                <div className="ui visible message" style={{backgroundColor:'#8FE17A'}}>
                                    <p key={key}>
                                        {msg.message}
                                    </p>
                                </div>
                        </div>
                    </div> :
                    <div className="ui visible message">
                        <p>{msg.message}</p>
                    </div>
                 }
                
            </div>) : <h5>No messages yet</h5>}
        </div> :<div>
            {messages ? messages.map((msg, key) => <div style={{marginTop:'10px'}} key={key}>
                {msg.sender === user.name ? <div className="ui right aligned grid">
                        <div className="column">
                                <div className="ui visible message" style={{backgroundColor:'#8FE17A'}}>
                                    <p key={key}>
                                        {msg.message}
                                    </p>
                                </div>
                        </div>
                    </div> :
                    <div className="ui visible message">
                        <div className="header">{msg.sender}</div>
                        <p>{msg.message}</p>
                    </div>
                 }
                
            </div>) : <h5>No messages yet</h5>}
        </div> 

    )
}

export default Messages
