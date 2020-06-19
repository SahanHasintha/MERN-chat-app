import React, {useState} from 'react'

const MessageInput = ({activeChat, onMessageSent}) => {
    const [message, setMessage] = useState('');

    const onSubmitMessage= (e) => {
        e.preventDefault();
        onMessageSent(message);
        setMessage('');
    }
    return (
        activeChat ? 
        <form onSubmit={(e) => onSubmitMessage(e)}>
            <div className="ui fluid action input">
            <input
                type="text"
                autoComplete={"off"}
                placeholder="type Something..."
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
            />

            <button
                className="ui button"
                type="submit"
            >Send</button>
            </div>
        </form>
        :
        <h3 style={{color:'#AB1A06'}}>Select the chat</h3>
    
)
}

export default MessageInput
