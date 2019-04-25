import React, { Component } from "react";
import { DOMAIN } from '../constants/constants';

export function loginUser(body) {
    return fetch(DOMAIN + 'tictactoe/uservalidation/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body,
    })
        .then(res => res.json())
        .then((result) => {
            return result
        },
            (error) => {
                console.log(error)
                return error
            }
        ).catch((error) => { console.log(error) });
}

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        };
    }

    handleChange = (event) => {
        const name = event.target.name
        this.setState({ [name]: event.target.value });
    }

    login = () => {
        var body = JSON.stringify({
            email: this.state.email,
            password: this.state.password
        })
        loginUser(body).then(result => {
            if (result.status){
                this.props.history.push({
                    pathname: '/user',
                    state: { token: result.response.token}
                })
            }else{
                alert(result.response)
            }
        })
    }

    gotoRegesterPage = () =>{
        this.props.history.push({
            pathname: '/register'
        })
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-4" />
                <div className="col-sm-4">
                    <div style={{ marginTop: "100px", fontSize: "25px" }}>
                        <center>User Login</center>    
                    </div>
                    <div>
                        <div className="row" style={{marginTop : "10px"}}>
                            <div className="col-sm-4">email :</div>
                            <input 
                                type="email" 
                                name="email" 
                                onChange={this.handleChange} 
                                style={{
                                    border:"1px solid",
                                    paddingLeft:"10px",
                                    borderRadius:"5px"
                                }}
                            />
                        </div>
                        <div className="row" style={{marginTop : "10px"}}>
                            <div className="col-sm-4"> password :</div>
                            <input 
                                type="password" 
                                name="password" 
                                onChange={this.handleChange} 
                                style={{
                                    border:"1px solid",
                                    paddingLeft:"10px",
                                    borderRadius:"5px"
                                }}
                            />
                        </div>
                        <div style={{marginTop : "10px"}}>
                            <button
                                type="button"
                                className="btn btn-success btn-block"
                                onClick={this.login}
                            >
                                Login
                            </button>
                        </div>
                        <div>
                            <center>
                                <button
                                    type="type"
                                    className="btn btn-link"
                                    onClick={this.gotoRegesterPage}
                                >
                                    For Register Click Here
                                </button>
                            </center>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}