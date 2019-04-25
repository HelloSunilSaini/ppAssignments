import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
//import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Register from "./pages/register";
import Login from "./pages/login";
import User from "./pages/user";
import TicTacToe from "./pages/tictactoe";
import Moves from "./pages/moves";

const CoreApp = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/user" component={User} />
            <Route path="/tictactoe" component={TicTacToe} />
            <Route path="/moves" component={Moves} />

            <Redirect from="/" to="/register" />
        </Switch>
    </BrowserRouter>
);

ReactDOM.render(<CoreApp />, document.getElementById("root"));
