import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
//import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Login from "./pages/login";
import User from "./pages/user";
import Master from "./pages/master";
import RentCar from "./pages/rentCar";

const CoreApp = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/login" component={Login} />
            <Route path="/user" component={User} />
            <Route path="/master" component={Master}/>
            <Route path="/rentCar" component={RentCar} /> 

            <Redirect from="/" to="/login" />
        </Switch>
    </BrowserRouter>
);

ReactDOM.render(<CoreApp />, document.getElementById("root"));
