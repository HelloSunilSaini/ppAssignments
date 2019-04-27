import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
//import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Login from "./pages/login";
import User from "./pages/user";
import Master from "./pages/master";

const CoreApp = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/login" component={Login} />
            <Route path="/user" component={User} />
            <Route path="/master" component={Master}/>

            <Redirect from="/" to="/login" />
        </Switch>
    </BrowserRouter>
);

ReactDOM.render(<CoreApp />, document.getElementById("root"));
