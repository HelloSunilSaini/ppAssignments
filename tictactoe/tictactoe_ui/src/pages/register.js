import React, { Component } from "react";
import { DOMAIN } from '../constants/constants';

export function createUser(body) {
    return fetch(DOMAIN + 'tictactoe/user/', {
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

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
        };
    }

    loginPage = () =>{
        this.props.history.push('/login');
    }

    handleChange = (event) => {
        const name = event.target.name
        this.setState({ [name]: event.target.value });
    }

    RegisterUser = () => {
        var body = JSON.stringify({
            name : this.state.name,
            email : this.state.email,
            password : this.state.password
        })
        createUser(body).then(result => {
            if (result.status){
                alert(result.messege)
                this.props.history.push('/login');
            }else{
                alert(result.messege)
            }
        })
        console.log("state",this.state)
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-4" />
                <div className="col-sm-4">
                    <div style={{ marginTop: "100px", fontSize: "25px" }}>
                        <center>Register User</center>
                    </div>
                    <div>
                        <div 
                            className="row" 
                            style={{
                                marginTop : "10px"
                            }}
                        >
                            <div className="col-sm-4">name :</div>
                            <input 
                                type="text" 
                                name="name" 
                                onChange={this.handleChange} 
                                style={{
                                    border:"1px solid",
                                    paddingLeft:"10px",
                                    borderRadius:"5px"
                                }}
                            />
                        </div>
                        <div 
                            className="row" 
                            style={{
                                marginTop : "10px"
                            }}
                        >
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
                        <div 
                            className="row" 
                            style={{
                                marginTop : "10px"
                            }}
                        >
                            <div className="col-sm-4">password :</div>
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
                                onClick={this.RegisterUser}
                            >
                                Register
                            </button>
                        </div>
                        <div style={{marginTop : "10px"}}>
                            <center>
                                <button
                                    type="button"
                                    className="btn btn-link"
                                    onClick={this.loginPage}
                                >
                                    for login click here
                                </button>
                            </center>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}