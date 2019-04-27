import React, { Component } from "react";
import { DOMAIN } from '../constants/constants';

export function loginUser(body) {
    return fetch(DOMAIN + 'rental_car/uservalidation/?userType=none', {
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

export function loginMaster(body) {
    return fetch(DOMAIN + 'rental_car/uservalidation/?userType=master', {
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
            master : false,
        };
    }

    handleChange = (event) => {
        const name = event.target.name
        this.setState({ [name]: event.target.value });
    }

    handlecheckbox = (event) =>{
        const name = event.target.name
        if (this.state.master){
            this.setState({[name] : false})
        }else{
            this.setState({[name] : true})
        } 
    }

    login = () => {
        var body = JSON.stringify({
            email: this.state.email,
            password: this.state.password
        })
        if (this.state.master){
            loginMaster(body).then(result => {
                if (result.status){
                    this.props.history.push({
                        pathname: '/master',
                        state: { 
                            email : this.state.email,
                            password : this.state.password
                        }
                    })
                }else{
                    alert(result.response)
                }
            })
        }else{
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
                        <div className="row" style={{marginTop:"20px"}}>
                            <input
                                type="checkbox"
                                onChange={this.handlecheckbox}
                                name="master"
                                style={{width:"20px",height:"20px",marginTop:"3px",marginLeft:"15px"}}
                            />
                            <div style={{marginLeft:"20px",color:"red"}}>
                                Login As Master
                            </div>
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
                    </div>
                </div>
            </div>
        );
    }
}