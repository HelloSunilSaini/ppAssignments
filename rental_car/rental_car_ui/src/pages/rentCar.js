import React, { Component } from "react";
import { DOMAIN } from '../constants/constants';


export function DropDownInsurance(props) {
    const mappingFunction = p => {
        return(
            <option key={p.insuranceId} value={p.insuranceId}>
                {p.insurance_name} - charges {p.price_percent_on_car_rent}% on Car Rent - {p.description}
            </option>
        )
    }
    return (
        <div>
            <select
                className="custom-select"
                style={{ 
                    width:"620px",
                    height:"20px",
                    fontSize:"12px",
                    marginLeft:"5px",
                    padding:"0px",
                    paddingLeft:"5px"
                }}
                value={props.default}
                name={props.name}
                type="text"
                onChange={props.onChange}
                onBlur={props.onBlur}
                required
            >
                {props.value.map(mappingFunction)}
            </select>
        </div>
    );
}

export function GetAllInsurance(token) {
    return fetch(DOMAIN + `rental_car/insurance/?token=${token}&&type=none`, {
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

export function CarRentBill(token,body) {
    return fetch(DOMAIN + `rental_car/carBill/?token=${token}`, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        body:body
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

export default class RentCar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: this.props.location.state.token,
            name: this.props.location.state.name,
            email: this.props.location.state.email,
            contact: this.props.location.state.contact,
            car: this.props.location.state.car,
            allInsurance: [],
            customerEmail: "",
            forDays: 1,
            insurance : null,
            loading: true,
        };
    }

    componentDidMount() {
        // console.log(this.state)
        this.getAllInsurance()
    }

    getAllInsurance = () => {
        GetAllInsurance(this.state.token).then(result => {
            if (result.status) {
                console.log(result)
                const defaultInsurance ={
                    insuranceId : null,
                    insurance_name : "None",
                    price_percent_on_car_rent : 0,
                    description : "Select Insurance"
                }
                var allInsurance = []
                allInsurance.push(defaultInsurance)
                allInsurance.push(...result.response)
                this.setState({ allInsurance: allInsurance, loading: false })
            } else {
                console.log(result.messege)
            }
        })
    }

    handleChange = (event) => {
        const name = event.target.name
        this.setState({ [name]: event.target.value },()=>{
            console.log(this.state)
        });
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

    rentCar = () =>{
        var body = JSON.stringify({
            forDays : parseInt(this.state.forDays),
            carId : this.state.car.carId,
            customerEmail : this.state.customerEmail,
            InsuranceId : this.state.insurance
        })
        CarRentBill(this.state.token,body).then(result => {
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
                            <div style={{ fontSize: 12 }} > Car Name : {this.state.car.car_name}</div>
                        </div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Car No : {this.state.car.car_no}</div>
                        </div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Model : {this.state.car.model}</div>
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: "10px" }}>
                        <div className="col-sm-1" />
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Color : {this.state.car.color}</div>
                        </div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Sitting Capacity : {this.state.car.sitting_capacity}</div>
                        </div>
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Mileage (in kmpl) : {this.state.car.mileage}</div>
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: "10px" }}>
                        <div className="col-sm-1" />
                        <div className="col-sm-3">
                            <div style={{ fontSize: 12 }} > Rent Per Day : {this.state.car.rent_per_day} </div>
                        </div>
                        <div className="col-sm-3">
                            {this.state.car.ac_status &&
                                <div style={{ fontSize: 12 }} > Ac Car</div>
                            }
                            {this.state.car.ac_status === false &&
                                <div style={{ fontSize: 12 }} > Non Ac Car</div>
                            }
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: "10px" }}>
                        <div className="col-sm-1" />
                        <div className="col-sm-3">
                            <div className="form-inline">
                                <div style={{ fontSize: 12 }} > Rent For Days : </div>
                                <input
                                    placeholder="Rent For Days"
                                    name="forDays"
                                    type="text"
                                    style={{
                                        paddingLeft: "5px",
                                        border: "1px solid",
                                        borderRadius: "2px",
                                        width:"100px",
                                        height:"20px",
                                        fontSize:"12px",
                                        marginLeft:"5px"
                                    }}
                                    value={this.state.forDays}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-inline">
                                <div style={{ fontSize: 12 }} > Customer Email : </div>
                                <input
                                    placeholder="Customer Email "
                                    name="customerEmail"
                                    type="text"
                                    style={{
                                        paddingLeft: "5px",
                                        border: "1px solid",
                                        borderRadius: "2px",
                                        width:"350px",
                                        height:"20px",
                                        fontSize:"12px",
                                        marginLeft:"5px"
                                    }}
                                    value={this.state.customerEmail}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: "10px" }}>
                        <div className="col-sm-1" />
                        <div className="col-sm-10">
                            <div className="form-inline">
                                <div style={{ fontSize: 12 }} > Choose Insurance : </div>
                                <DropDownInsurance name="insurance" value={this.state.allInsurance} onChange={this.handleChange}/>
                            </div>
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
                                Rent Car
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
