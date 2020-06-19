import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import Register from './component/Register';
import Layout from './component/Layout';
import Login from './component/Login';
import Group from './component/group';

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Route path="/" exact component={Layout} />
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                <Route path = "/create-group/:id" component={Group}/>
            </BrowserRouter>
        </div>
    )
}

export default App
