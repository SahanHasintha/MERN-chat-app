import React, {useState} from 'react';
import socket from '../utils/socketConn';
import firebase from '../firebase/firenaseInitialize';
import { withRouter, Link } from 'react-router-dom';
import {USER_REGISTER} from '../Event';

const Register = ({history}) => {
    const [formData, setFormData] = useState({
        name:'',
        email:'',
        password:''
    })
    const [profilePicture, setprofilePicture] = useState(null);

    const {name, email, password} = formData;
    
    const onChangeText = (e) => {
        setFormData({
            ...formData, [e.target.name]:e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        let bucketName = 'profile-pictures';
        let file = profilePicture;
        let storageRef = firebase.storage().ref(`${bucketName}/${file.name}`);
        let uploadTask = storageRef.put(file);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                () => {},
                () => {},
                async () => {
                    await uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
                        if(downloadURL !== null){
                            console.log(downloadURL);
                            socket.emit(USER_REGISTER, {...formData, profilePic:downloadURL}, ({error, user}) => {
                                if(error){
                                    alert(error);
                                }
                                if(user){
                                    console.log(user);
                                    history.push('/')
                                }
                            })
                        }
                    })
                }
            )
        
    }

    return (
        <div style={{paddingLeft:'20%', paddingRight:'20%', paddingTop:'10%'}}>
            <form style={{flexDirection:'column'}} className="ui form" onSubmit={(e) => onSubmit(e)}>
                <h4 className="ui dividing header">Register</h4>
                <div className="field">
                    <label>Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Enter your name" 
                        value={name}
                        onChange={(e) => onChangeText(e)}
                    />
                </div>
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
                <div className="field">
                    <input 
                        type="file" 
                        onChange={(e) => setprofilePicture(e.target.files[0])}
                    />
                </div>
                <button className="ui button" type="submit">Submit</button>
            </form>
            <Link to="/">
            if You Have An Account Please Loggin 
            </Link>
            
        </div>
    )
}

export default withRouter(Register);
