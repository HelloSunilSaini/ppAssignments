import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { DOMAIN } from '../constants/constants';

export function GetAllUser(email, password) {
    return fetch(DOMAIN + `rental_car/user/?type=master&&master_email=${email}&&master_password=${password}`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
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

export function AddUser(email, password,body) {
    return fetch(DOMAIN + `rental_car/user/?type=master&&master_email=${email}&&master_password=${password}`, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        body : body
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

export function DeleteUser(email, password,userId) {
    return fetch(DOMAIN + `rental_car/user/?type=master&&master_email=${email}&&master_password=${password}&&userId=${userId}`, {
        method: 'PUT',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }
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

export default class Master extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.location.state.email,
            password: this.props.location.state.password,
            allUsers: [],
            user_name: "",
            user_email: "",
            user_password: "",
            address_line_1: "",
            address_line_2: "",
            landMark: "",
            city: "",
            state: "",
            pincode: "",
            contact_no: "",
            loading: true,
        };
    }

    componentDidMount() {
        this.getAllUserDetails()
    }

    handleChange = (event) => {
        const name = event.target.name
        this.setState({ [name]: event.target.value });
    }

    getAllUserDetails = () => {
        GetAllUser(this.state.email, this.state.password).then(result => {
            if (result.status) {
                console.log(result.messege)
                console.log(result.response)
                this.setState({
                    allUsers: result.response,
                    loading: false,
                })
            } else {
                console.log(result.messege)
            }
        })
    }

    adduser = () => {
        var body = JSON.stringify({
            name : this.state.user_name,
            email : this.state.user_email,
            password  :this.state.user_password,
            address : {
                address_line_1 : this.state.address_line_1,
                address_line_2 : this.state.address_line_2,
                landMark : this.state.landMark,
                city : this.state.city,
                state : this.state.state,
                pincode : this.state.pincode
            },
            contact_no : this.state.contact_no
        })
        AddUser(this.state.email,this.state.password,body).then(result => {
            if (result.status){
                alert(result.messege)
                this.getAllUserDetails()
            }else{
                alert(result.messege)
            }
        })
    }

    deleteuser = (userId) => {
        DeleteUser(this.state.email,this.state.password,userId).then(result => {
            if (result.status){
                alert(result.messege)
                this.getAllUserDetails()
            }else{
                alert(result.messege)
            }
        })
    }

    logout = () => {
        this.props.history.push({
            pathname: '/login'
        })
    }

    userTable = [
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > Name </div>,
            id: "name",
            accessor: d => d.name,
            Cell: row => <center>{row.original.name}</center>,
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'break-word' }
        },
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > Email </div>,
            id: "email",
            accessor: d => d.email,
            Cell: row => <center>{row.original.email}</center>,
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'break-word' }
        },
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > Contact </div>,
            id: "contact_no",
            accessor: d => d.contact_no,
            Cell: row => <center>{row.original.contact_no}</center>,
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'break-word' }
        }
        ,
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > Address </div>,
            id: "userId",
            accessor: d => d.userId,
            Cell: row => <center>{row.original.address.city}</center>,
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'Ce' }
        }
        ,
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > Action </div>,
            id: "userId",
            accessor: d => d.userId,
            Cell: row =>(
                <center>
                    <button 
                        className="btn btn-danger" 
                        style={{
                            height: "30px",
                            paddingTop: "1px",
                            paddingLeft: "5px",
                            paddingBottom: "1px",
                            paddingRight: "5px",
                        }}
                        onClick={() => {this.deleteuser(row.original.userId)}}
                    >
                        Delete
                    </button>
                </center>
            ),
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'Ce' }
        }
    ];

    render() {
        var inputStyle = {
            paddingLeft: "10px",
            border: "1px solid",
            borderRadius: "5px",
        }
        var addressLineStyle = {
            paddingLeft: "10px",
            border: "1px solid",
            borderRadius: "5px",
            width:"300px"
        }

        if (this.state.loading === true) {
            return (
                <div style={{ marginTop: "50px" }}>
                    <center>
                        Loading...
                    </center>
                </div>
            )
        }
        else {
            return (
                <div style={{ overflowX: "hidden" }}>
                    <Tabs>
                        <div >
                            <button
                                className="btn btn-danger"
                                style={{
                                    height: "30px",
                                    paddingTop: "1px",
                                    paddingLeft: "5px",
                                    paddingBottom: "1px",
                                    paddingRight: "5px",
                                    marginLeft: "90%",
                                    marginTop: "20px"
                                }}
                                onClick={this.logout}
                            >
                                Logout
                            </button>
                            <TabList >
                                <Tab style={{ marginLeft: "20px" }}>Users</Tab>
                                <Tab style={{ marginLeft: "20px" }}>Add User</Tab>
                            </TabList>
                        </div>
                        <TabPanel>
                            <div style={{marginLeft:"20px",marginRight:"20px"}}>
                                <ReactTable
                                    defaultFilterMethod={(filter, row) =>
                                        String(row[filter.id]) === filter.value}
                                    data={this.state.allUsers}
                                    sortable={false}
                                    columns={this.userTable}
                                    defaultPageSize={5}
                                    showPagination={true}
                                />
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div style={{ width: "100%" }}>
                                <div className="row">
                                    <div className="col-sm-1"/>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Name :</div>
                                        <input
                                            placeholder="Name"
                                            name="user_name"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.user_name}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Email :</div>
                                        <input
                                            placeholder="Email"
                                            name="user_email"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.user_email}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{marginTop:"10px"}}>
                                    <div className="col-sm-1"/>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Password :</div>
                                        <input
                                            placeholder="Password"
                                            name="user_password"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.user_password}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Contect No :</div>
                                        <input
                                            placeholder="Contect No"
                                            name="contact_no"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.contact_no}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div style={{marginTop:"15px",marginLeft:"20px",fontWeight:"bold"}}> Address :</div>
                                <div className="row">
                                    <div className="col-sm-1"/>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Address Line 1 :</div>
                                        <input
                                            placeholder="Address line 1 "
                                            name="address_line_1"
                                            type="text"
                                            style={addressLineStyle}
                                            value={this.state.address_line_1}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Address line 2 :</div>
                                        <input
                                            placeholder="Address line 2 "
                                            name="address_line_2"
                                            type="text"
                                            style={addressLineStyle}
                                            value={this.state.address_line_2}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{marginTop:"10px"}}>
                                    <div className="col-sm-1"/>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > City :</div>
                                        <input
                                            placeholder="City"
                                            name="city"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.city}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > State :</div>
                                        <input
                                            placeholder="State"
                                            name="state"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.state}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div><div className="row" style={{marginTop:"10px"}}>
                                    <div className="col-sm-1"/>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > LandMark :</div>
                                        <input
                                            placeholder="LandMark"
                                            name="landMark"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.landMark}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Pincode :</div>
                                        <input
                                            placeholder="Pincode"
                                            name="pincode"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.pincode}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <button
                                    className="btn btn-success"
                                    style={{
                                        height: "30px",
                                        paddingTop: "1px",
                                        paddingLeft: "5px",
                                        paddingBottom: "1px",
                                        paddingRight: "5px",
                                        marginLeft: "47%",
                                        marginTop: "30px"
                                    }}
                                    onClick={this.adduser}
                                >
                                    Add User
                                </button>
                            </div>
                        </TabPanel>
                    </Tabs>
                </div>
            );
        }
    }
}
