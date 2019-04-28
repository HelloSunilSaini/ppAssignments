import React, { Component } from "react";
import { DOMAIN } from '../constants/constants';

export function Logout(token) {
    return fetch(DOMAIN + `rental_car/uservalidation/?token=${token}`, {
        method: 'PUT',
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

export function MarkCarReturn(token,carBillId) {
    return fetch(DOMAIN + `rental_car/carBill/?token=${token}`, {
        method: 'PUT',
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Content-Type': 'application/json',
        },
        body : JSON.stringify({rentBillId : carBillId})
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

export default class RentCarDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: this.props.location.state.token,
            name: this.props.location.state.name,
            email: this.props.location.state.email,
            contact: this.props.location.state.contact,
            carbill: this.props.location.state.carbill,
            loading: false,
        };
    }

    componentDidMount() {
        console.log(this.state)
    }

    handleChange = (event) => {
        const name = event.target.name
        this.setState({ [name]: event.target.value });
    }

    logout = () => {
        Logout(this.state.token).then(result => {
            if (result.status) {
                this.gotoLoginPage()

            } else {
                alert(result.messege)
            }
        })
    }
    markReturn = () =>{
        MarkCarReturn(this.state.token,this.state.carbill.rentBillId).then(result =>{
            if(result.status){
                alert(result.messege)
                this.gotoUserPage()
            }else{
                alert(result.messege)
            }
        })
    }

    gotoUserPage = () => {
        console.log()
        this.props.history.push({
            pathname: '/user',
            state: { 
                token : this.state.token,
            }
        })
    }

    gotoLoginPage = () => {
        this.props.history.push({
            pathname: '/login'
        })
    }

    render() {

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
                <div style={{ width: "100%", overflowX: "hidden" }}>
                    <div
                        className="row"
                        style={{ marginTop: "20px", marginLeft: "20px" }}
                    >
                        <div className="col-sm-3">
                            <b>Name : </b> {this.state.name}
                        </div>
                        <div className="col-sm-4">
                            <b>Email : </b> {this.state.email}
                        </div>
                        <div className="col-sm-3">
                            <b>Contact : </b> {this.state.contact}
                        </div>
                        <div className="col-sm-2">
                            <button
                                className="btn btn-danger"
                                style={{
                                    height: "30px",
                                    paddingTop: "1px",
                                    paddingLeft: "5px",
                                    paddingBottom: "1px",
                                    paddingRight: "5px"
                                }}
                                onClick={this.logout}
                            >
                                Logout
                                    </button>
                        </div>
                    </div>
                    <hr />
                    <div style={{ fontWeight: "bold", marginLeft: "20px" }}> Car Details : </div>
                    <div className="row">
                        <div className="col-sm-1"></div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Car Name : {this.state.carbill.car.car_name}</div>
                        </div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Car No : {this.state.carbill.car.car_no}</div>
                        </div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Model : {this.state.carbill.car.model}</div>
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: "10px" }}>
                        <div className="col-sm-1" />
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Color : {this.state.carbill.car.color}</div>
                        </div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Sitting Capacity : {this.state.carbill.car.sitting_capacity}</div>
                        </div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Mileage (in kmpl) : {this.state.carbill.car.mileage}</div>
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: "10px" }}>
                        <div className="col-sm-1" />
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Rent Per Day : {this.state.carbill.car.rent_per_day} </div>
                        </div>
                        <div className="col-sm-3">
                            {this.state.carbill.car.ac_status &&
                                <div style={{ fontSize: 12 }} > Ac Car</div>
                            }
                            {this.state.carbill.car.ac_status === false &&
                                <div style={{ fontSize: 12 }} > Non Ac Car</div>
                            }
                        </div>
                    </div>
                    <div style={{ fontWeight: "bold", marginLeft: "20px" }}> Customer Details : </div>
                    <div className="row">
                        <div className="col-sm-1"></div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Name : {this.state.carbill.customer.name}</div>
                        </div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Email : {this.state.carbill.customer.email}</div>
                        </div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Contact No : {this.state.carbill.customer.contact_no}</div>
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: "10px" }}>
                        <div className="col-sm-1" />
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12,fontWeight:"bold" }} > Address Details :</div>
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: "10px" }}>
                        <div className="col-sm-1" />
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Address Line 1 : {this.state.carbill.customer.address.address_line_1}</div>
                        </div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Address Line 2 : {this.state.carbill.customer.address.address_line_2}</div>
                        </div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > LandMark : {this.state.carbill.customer.address.landMark}</div>
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: "10px" }}>
                        <div className="col-sm-1" />
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > City : {this.state.carbill.customer.address.city}</div>
                        </div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > State: {this.state.carbill.customer.address.state}</div>
                        </div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Pincode : {this.state.carbill.customer.address.pincode}</div>
                        </div>
                    </div>
                    <div style={{ fontWeight: "bold", marginLeft: "20px" }}> Insurance Details : </div>
                    <div className="row">
                        <div className="col-sm-1"></div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Name : {this.state.carbill.insurance.insurance_name}</div>
                        </div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > % Charge On Car Rent: {this.state.carbill.insurance.price_percent_on_car_rent}%</div>
                        </div>
                        <div className="col-sm-5">
                            <div style={{ fontSize: 12 }} > Description : {this.state.carbill.insurance.description}</div>
                        </div>
                    </div>
                    <div className="row" style={{marginTop:"20px"}}>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12,fontWeight:"bold" }} > Rented For Days : {this.state.carbill.forDays}</div>
                        </div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12,fontWeight:"bold" }} > Total Amount: {this.state.carbill.grandTotal}</div>
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: "30px" }}>
                        <div className="col-sm-2" />
                        <div className="col-sm-1">
                            <button
                                className="btn btn-info"
                                style={{
                                    height: "30px",
                                    paddingTop: "1px",
                                    paddingLeft: "5px",
                                    paddingBottom: "1px",
                                    paddingRight: "5px",
                                }}
                                onClick={this.gotoUserPage}
                            >
                                Go Back
                            </button>
                        </div>
                        <div className="col-sm-4" />
                        <div className="col-sm-3">
                            {this.state.carbill.status === "ON_RENT" &&
                                <button
                                    className="btn btn-success"
                                    style={{
                                        height: "30px",
                                        paddingTop: "1px",
                                        paddingLeft: "5px",
                                        paddingBottom: "1px",
                                        paddingRight: "5px",
                                    }}
                                    onClick={this.rentCar}
                                >
                                    Mark Returned
                                </button>
                            }
                        </div>
                    </div>
                </div>
            );
        }
    }
}
