import React,{useState} from 'react'
import { Link } from 'react-router-dom';
import socket from '../utils/socketConn';
import { USER_LOGIN } from '../Event';

const Login = ({setUser}) => {
    const [formData, setFormData] = useState({
        email:'',
        password:''
    })

    const {email, password} = formData;
    const onSubmit = (e)=> {
        e.preventDefault();
        socket.emit(USER_LOGIN, formData, ({error, user})=> {
            if(error){
                alert(error);
            }else{
                console.log(user)
                setUser(user);
            }
        })
    }

    const onChangeText = (e) => {
        setFormData({
            ...formData, [e.target.name]:e.target.value
        })
    }

    return (
        <div style={{paddingLeft:'20%', paddingRight:'20%', paddingTop:'10%'}}>
            <form style={{flexDirection:'column'}} className="ui form" onSubmit={(e) => onSubmit(e)}>
                <h4 className="ui dividing header">Login</h4>
                
                <div className="field">
                    <label>Email</label>
                    <input 
                        type="text" 
                        name="email" 
                        placeholder="Enter Email" 
                        value={email}
                        onChange={(e) => onChangeText(e)}
                    />
                </div>
                <div className="field">
                    <label>Password</label>
                    <input 
                        type="text" 
                        name="password" 
                        placeholder="Enter password" 
                        value={password}
                        onChange={(e) => onChangeText(e)}
                    />
                </div>
                <button className="ui button" type="submit">Submit</button>
            </form>
            <Link to="/register">
            If you have not account please register
            </Link>
            
        </div>
    )
}

export default Login
