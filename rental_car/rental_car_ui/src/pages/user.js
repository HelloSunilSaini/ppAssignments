import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { DOMAIN } from '../constants/constants';

export function GetUser(token) {
    return fetch(DOMAIN + `rental_car/user/?token=${token}&&type=none`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin' : '*',
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

export function GetAvailableCars(token) {
    return fetch(DOMAIN + `rental_car/car/?token=${token}&&type=STATUS&&status=AVAILABLE`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin' : '*',
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

export function GetRentedCars(token) {
    return fetch(DOMAIN + `rental_car/carBill/?token=${token}&&type=STATUS&&status=ON_RENT`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin' : '*',
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

export function GetRentCarHistory(token) {
    return fetch(DOMAIN + `rental_car/carBill/?token=${token}&&type=STATUS&&status=RETURNED`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin' : '*',
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

export function Logout(token) {
    return fetch(DOMAIN + `rental_car/uservalidation/?token=${token}`, {
        method: 'PUT',
        headers: {
            'Access-Control-Allow-Origin' : '*',
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

export function AddCustomer(token,body) {
    return fetch(DOMAIN + `rental_car/customer/?token=${token}`, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin' : '*',
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

export function AddCar(token,body) {
    return fetch(DOMAIN + `rental_car/car/?token=${token}`, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin' : '*',
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

export function AddInsuranse(token,body) {
    return fetch(DOMAIN + `rental_car/insurance/?token=${token}`, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin' : '*',
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

export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: this.props.location.state.token,
            userId: "",
            name: "",
            email: "",
            contact :"",
            address : {},

            availableCars : [],

            onRentCars : [],

            carRentHistory : [],

            cust_name : "",
            cust_email : "",
            cust_contact : "",
            cust_address_line_1 : "",
            cust_address_line_2 : "",
            cust_landMark : "",
            cust_city : "",
            cust_state : "",
            cust_pincode : "",

            car_name : "",
            car_model : "",
            car_no : "",
            car_ac_status : false,
            car_sitting_capacity : "",
            car_color : "",
            car_mileage : "",
            car_rent_per_day : "",

            insurance_name : "",
            insurance_price_percent : "",
            insurance_description : "",
         };
    }

    componentDidMount() {
        this.getUserDetails()
        this.getAvailableCars()
        this.getRentedCars()
        this.getRentCarHistory()
    }

    handleChange = (event) => {
        const name = event.target.name
        this.setState({ [name]: event.target.value });
    }

    handleCarAc = (event) => {
        if (this.state.car_ac_status) {
            this.setState({car_ac_status : false})
        }else{
            this.setState({car_ac_status : true})
        }
    }

    getUserDetails = () => {
        GetUser(this.state.token).then(result => {
            if (result.status) {
                console.log(result.messege)
                this.setState({
                    userId: result.response.userId,
                    name: result.response.name,
                    email: result.response.email,
                    contact : result.response.contact_no,
                    address : result.response.address,
                    loading : false,
                })
            } else {
                console.log(result.messege)
            }
        })
    }

    getAvailableCars = () =>{
        GetAvailableCars(this.state.token).then(result =>{
            if(result.status){
                this.setState({availableCars : result.response})
            }else{
                console.log(result.messege)
            }
        })
    }

    getRentedCars = () => {
        GetRentedCars(this.state.token).then(result =>{
            if(result.status){
                console.log(result.response)
                this.setState({onRentCars : result.response})
            }else{
                console.log(result.messege)
            }
        })
    }

    getRentCarHistory = () => {
        GetRentCarHistory(this.state.token).then(result =>{
            if(result.status){
                console.log(result.response)
                this.setState({carRentHistory : result.response})
            }else{
                console.log(result.messege)
            }
        })
    }

    logout = () =>{
        Logout(this.state.token).then(result => {
            if (result.status){
                this.gotoLoginPage()

            }else{
                alert(result.messege)
            }
        })
    }

    addCustomer = () => {
        var body = JSON.stringify({
            name : this.state.cust_name,
            email : this.state.cust_email,
            address : {
                address_line_1 : this.state.cust_address_line_1,
                address_line_2 : this.state.cust_address_line_2,
                landMark : this.state.cust_landMark,
                city : this.state.cust_city,
                state : this.state.cust_state,
                pincode : this.state.cust_pincode
            },
            contact_no : this.state.cust_contact
        })
        AddCustomer(this.state.token,body).then(result => {
            if (result.status){
                alert(result.messege)
                this.setState({
                    cust_address_line_1:"",
                    cust_address_line_2 : "",
                    cust_city:"",
                    cust_contact:"",
                    cust_email :"",
                    cust_landMark:"",
                    cust_name:"",
                    cust_pincode:"",
                    cust_state:""
                })

            }else{
                alert(result.messege)
            }
        })
    }

    addCar = () => {
        var body = JSON.stringify({
            car_name : this.state.car_name,
            model :  this.state.car_model,
            color :  this.state.car_color,
            car_no : this.state.car_no,
            ac_status : this.state.car_ac_status,
            sitting_capacity : parseInt(this.state.car_sitting_capacity),
            mileage :  parseInt(this.state.car_mileage),
            rent_per_day: parseInt(this.state.car_rent_per_day),
        })
        AddCar(this.state.token,body).then(result => {
            if(result.status){
                alert(result.messege)
                this.setState({
                    car_name : "",
                    car_model : "",
                    car_no : "",
                    car_sitting_capacity : "",
                    car_color : "",
                    car_mileage : "",
                    car_rent_per_day : "",
                })
                this.getAvailableCars()
            }else{
                alert(result.messege)
            }
        })
    }

    addInsurance = () => {
        var body = JSON.stringify({
            insurance_name : this.state.insurance_name,
            price_percent_on_car_rent : parseInt(this.state.insurance_price_percent),
            description : this.state.insurance_description
        })
        AddInsuranse(this.state.token,body).then(result => {
            if(result.status){
                alert(result.messege)
                this.setState({
                    insurance_name : "",
                    insurance_price_percent : "",
                    insurance_description : "",
                })
            }else{
                alert(result.messege)
            }
        })
    }

    gotoLoginPage = () => {
        this.props.history.push({
            pathname: '/login'
        })
    }

    rentCar = (car) => {
        console.log(car)
        this.props.history.push({
            pathname: '/rentCar',
            state: { 
                token : this.state.token,
                name : this.state.name,
                email : this.state.email,
                password : this.state.password,
                contact : this.state.contact,
                car : car
            }
        })
    }

    carBillDetails = (carbill) => {
        this.props.history.push({
            pathname: '/rentCarDetails',
            state: { 
                token : this.state.token,
                name : this.state.name,
                email : this.state.email,
                password : this.state.password,
                contact : this.state.contact,
                carbill : carbill
            }
        })
    }

    markReturn = (carbill) =>{
        MarkCarReturn(this.state.token,carbill.rentBillId).then(result =>{
            if(result.status){
                alert(result.messege)
                this.getAvailableCars()
                this.getRentedCars()
                this.getRentCarHistory()
            }else{
                alert(result.messege)
            }
        })
    }

    carTable = [
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > Car Name</div>,
            id: "car_name",
            accessor: d => d.car_name,
            Cell: row => (
                <center>
                    {row.original.car_name} 
                    {row.original.ac_status &&
                        <div>  - AC </div>
                    }
                    {row.original.ac_status === false&&
                        <div>  - Non AC </div>
                    }
                </center>
            ),
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'break-word' }
        },
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > Car No. </div>,
            id: "car_no",
            accessor: d => d.car_no,
            Cell: row => <center>{row.original.car_no}</center>,
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'break-word' }
        },
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > Mileage(kmpl) / Model </div>,
            id: "mileage",
            accessor: d => d.mileage,
            Cell: row => <center>{row.original.mileage} / {row.original.model}</center>,
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'break-word' }
        }
        ,
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > Capacity / Color </div>,
            id: "sitting_capacity",
            accessor: d => d.sitting_capacity,
            Cell: row => <center>{row.original.sitting_capacity} / {row.original.color}</center>,
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'break-word' }
        },
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > Rent Per Day </div>,
            id: "rent_per_day",
            accessor: d => d.rent_per_day,
            Cell: row => <center>{row.original.rent_per_day}</center>,
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'break-word' }
        }
        ,
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > Action </div>,
            id: "userId",
            accessor: d => d.userId,
            Cell: row =>(
                <center>
                    <button 
                        className="btn btn-success" 
                        style={{
                            height: "30px",
                            paddingTop: "1px",
                            paddingLeft: "5px",
                            paddingBottom: "1px",
                            paddingRight: "5px",
                        }}
                        onClick={() => {this.rentCar(row.original)}}
                    >
                        Rent
                    </button>
                </center>
            ),
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'Ce' }
        }
    ];

    carRentTable = [
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > Car </div>,
            id: "car_name",
            accessor: d => d.car.carId,
            Cell: row => (
                <center>
                    {row.original.car.car_name} ({row.original.car.car_no}) {row.original.car.rent_per_day} per day
                </center>
            ),
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'break-word' }
        },
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > Customer </div>,
            id: "car_no",
            accessor: d => d.customer.customerId,
            Cell: row => <center>{row.original.customer.name} ({row.original.customer.email})</center>,
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'break-word' }
        },
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > Insurance </div>,
            id: "mileage",
            accessor: d => d.insurance.insuranceId,
            Cell: row => <center>{row.original.insurance.insurance_name} ({row.original.insurance.price_percent_on_car_rent}% on car rent)</center>,
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'break-word' }
        }
        ,
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > For Days | Total Amt </div>,
            id: "sitting_capacity",
            accessor: d => d.rentBillId,
            Cell: row => <center>{row.original.forDays} | {row.original.grandTotal}</center>,
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'break-word' }
        }
        ,
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > Action </div>,
            id: "userId",
            accessor: d => d.userId,
            Cell: row =>(
                <center>
                    <button 
                        className="btn btn-info" 
                        style={{
                            paddingTop: "1px",
                            paddingLeft: "1px",
                            paddingBottom: "1px",
                            paddingRight: "1px",
                            height:"20px",
                            fontSize:"10px",
                            fontWeight:"bold"
                        }}
                        onClick={() => {this.carBillDetails(row.original)}}
                    >
                        Details
                    </button>
                    <button 
                        className="btn btn-success" 
                        style={{
                            paddingTop: "1px",
                            paddingLeft: "1px",
                            paddingBottom: "1px",
                            paddingRight: "1px",
                            height:"20px",
                            fontSize:"10px",
                            fontWeight:"bold",
                            marginLeft:"5px"
                        }}
                        onClick={() => {this.markReturn(row.original)}}
                    >
                        Mark Returned
                    </button>
                </center>
            ),
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'Ce' }
        }
    ];

    carRentTable1 = [
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > Car </div>,
            id: "car_name",
            accessor: d => d.car.carId,
            Cell: row => (
                <center>
                    {row.original.car.car_name} ({row.original.car.car_no}) {row.original.car.rent_per_day} per day
                </center>
            ),
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'break-word' }
        },
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > Customer </div>,
            id: "car_no",
            accessor: d => d.customer.customerId,
            Cell: row => <center>{row.original.customer.name} ({row.original.customer.email})</center>,
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'break-word' }
        },
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > Insurance </div>,
            id: "mileage",
            accessor: d => d.insurance.insuranceId,
            Cell: row => <center>{row.original.insurance.insurance_name} ({row.original.insurance.price_percent_on_car_rent}% on car rent)</center>,
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'break-word' }
        }
        ,
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > For Days | Total Amt </div>,
            id: "sitting_capacity",
            accessor: d => d.rentBillId,
            Cell: row => <center>{row.original.forDays} | {row.original.grandTotal}</center>,
            style: { whiteSpace: 'pre-line', fontSize: 14, overflowWrap: 'break-word' }
        }
        ,
        {
            Header: () => <div style={{ fontSize: 15, fontWeight: "bold" }} > Action </div>,
            id: "userId",
            accessor: d => d.userId,
            Cell: row =>(
                <center>
                    <button 
                        className="btn btn-info" 
                        style={{
                            paddingTop: "1px",
                            paddingLeft: "1px",
                            paddingBottom: "1px",
                            paddingRight: "1px",
                            height:"20px",
                            fontSize:"10px",
                            fontWeight:"bold"
                        }}
                        onClick={() => {this.carBillDetails(row.original)}}
                    >
                        Details
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
        
        if (this.state.loading === true 
            ||this.state.loading1 === true
            ||this.state.loading2 === true
            ||this.state.loading3 === true
            ||this.state.loading4 === true) {
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
                <div style={{ width: "100%",overflowX: "hidden" }}>
                    <Tabs>
                        <div >
                            <div
                                className="row"
                                style={{ marginTop: "20px",marginLeft:"20px" }}
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
                                            height:"30px",
                                            paddingTop:"1px",
                                            paddingLeft:"5px",
                                            paddingBottom:"1px",
                                            paddingRight:"5px"
                                        }}
                                        onClick={this.logout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                            <TabList style={{ margin: "10px" }} >
                                <Tab>Available Cars</Tab>
                                <Tab>Cars on Rent</Tab>
                                <Tab>Add Car</Tab>
                                <Tab>Add Customer</Tab>
                                <Tab>Add Insurance</Tab>
                                <Tab>Car Rent History</Tab>
                            </TabList>
                        </div>
                        <TabPanel>
                            <div>
                                <ReactTable
                                    defaultFilterMethod={(filter, row) =>
                                        String(row[filter.id]) === filter.value}
                                    data={this.state.availableCars}
                                    sortable={false}
                                    columns={this.carTable}
                                    defaultPageSize={5}
                                    showPagination={true}
                                />
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div>
                                <ReactTable
                                    defaultFilterMethod={(filter, row) =>
                                        String(row[filter.id]) === filter.value}
                                    data={this.state.onRentCars}
                                    sortable={false}
                                    columns={this.carRentTable}
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
                                        <div style={{ fontSize: 12 }} > Car Name :</div>
                                        <input
                                            placeholder="Car Name"
                                            name="car_name"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.car_name}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Car No :</div>
                                        <input
                                            placeholder="Car No"
                                            name="car_no"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.car_no}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{marginTop:"10px"}}>
                                    <div className="col-sm-1"/>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Model :</div>
                                        <input
                                            placeholder="Model"
                                            name="car_model"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.car_model}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Color :</div>
                                        <input
                                            placeholder="Color"
                                            name="car_color"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.car_color}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{marginTop:"10px"}}>
                                    <div className="col-sm-1"/>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Sitting Capacity :</div>
                                        <input
                                            placeholder="Sitting Capacity"
                                            name="car_sitting_capacity"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.car_sitting_capacity}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Mileage (in kmpl) :</div>
                                        <input
                                            placeholder="Mileage (in kmpl)"
                                            name="car_mileage"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.car_mileage}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div><div className="row" style={{marginTop:"10px"}}>
                                    <div className="col-sm-1"/>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Rent Per Day :</div>
                                        <input
                                            placeholder="Rent Per Day"
                                            name="car_rent_per_day"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.car_rent_per_day}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > AC Status :</div>
                                        <div className="row" style={{marginLeft : "10px",marginTop:"8px"}}>
                                            <input
                                                name="pincode"
                                                type="checkbox"
                                                style={{width:"15px",height:"15px"}}
                                                checked={this.state.car_ac_status}
                                                value={this.state.pincode}
                                                onChange={this.handleCarAc}
                                            />
                                            <div style={{fontSize:"10px",marginLeft:"15px"}}>
                                                ( Tick if Car have AC )
                                            </div>
                                        </div>
                                        
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
                                        marginLeft: "46%",
                                        marginTop: "30px"
                                    }}
                                    onClick={this.addCar}
                                >
                                    Add Car
                                </button>
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
                                            name="cust_name"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.cust_name}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Email :</div>
                                        <input
                                            placeholder="Email"
                                            name="cust_email"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.cust_email}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{marginTop:"10px"}}>
                                    <div className="col-sm-1"/>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Contect No :</div>
                                        <input
                                            placeholder="Contect No"
                                            name="cust_contact"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.cust_contact}
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
                                            name="cust_address_line_1"
                                            type="text"
                                            style={addressLineStyle}
                                            value={this.state.cust_address_line_1}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Address line 2 :</div>
                                        <input
                                            placeholder="Address line 2 "
                                            name="cust_address_line_2"
                                            type="text"
                                            style={addressLineStyle}
                                            value={this.state.cust_address_line_2}
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
                                            name="cust_city"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.cust_city}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > State :</div>
                                        <input
                                            placeholder="State"
                                            name="cust_state"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.cust_state}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div><div className="row" style={{marginTop:"10px"}}>
                                    <div className="col-sm-1"/>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > LandMark :</div>
                                        <input
                                            placeholder="LandMark"
                                            name="cust_landMark"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.cust_landMark}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Pincode :</div>
                                        <input
                                            placeholder="Pincode"
                                            name="cust_pincode"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.cust_pincode}
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
                                        marginLeft: "44%",
                                        marginTop: "30px"
                                    }}
                                    onClick={this.addCustomer}
                                >
                                    Add Customer
                                </button>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div style={{ width: "100%" }}>
                                <div className="row">
                                    <div className="col-sm-1"/>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Insurance Name :</div>
                                        <input
                                            placeholder="Insurance Name"
                                            name="insurance_name"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.insurance_name}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Price % On Car rent :</div>
                                        <input
                                            placeholder="Price % On Car rent"
                                            name="insurance_price_percent"
                                            type="text"
                                            style={inputStyle}
                                            value={this.state.insurance_price_percent}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{marginTop:"20px"}}>
                                    <div className="col-sm-1"/>
                                    <div className="col-sm-5">
                                        <div style={{ fontSize: 12 }} > Description :</div>
                                        <textarea
                                            placeholder="Description"
                                            name="insurance_description"
                                            type="textarea"
                                            style={{
                                                width:"683px",
                                                border :"1px solid",
                                                borderRadius:"5px"
                                            }}
                                            value={this.state.insurance_description}
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
                                        marginLeft: "45%",
                                        marginTop: "30px"
                                    }}
                                    onClick={this.addInsurance}
                                >
                                    Add Insurance
                                </button>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div>
                                <ReactTable
                                    defaultFilterMethod={(filter, row) =>
                                        String(row[filter.id]) === filter.value}
                                    data={this.state.carRentHistory}
                                    sortable={false}
                                    columns={this.carRentTable1}
                                    defaultPageSize={5}
                                    showPagination={true}
                                />
                            </div>
                        </TabPanel>
                    </Tabs>
                </div>
            );
        }
    }
}
