import React, { Component } from "react";
// import ReactTable from "react-table";
// import "react-table/react-table.css";
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';
import { DOMAIN } from '../constants/constants';


export default class Master extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token : this.props.location.state.token,
            email: this.props.location.state.email,
            password: this.props.location.state.password,
            contact : this.props.location.state.contact,
            car : this.props.location.state.car,
            allInsurance: [],
            customerEmail : "",
            forDays : 0,
            loading: true,
        };
    }

    componentDidMount() {
        this.getAllInsurance()
    }

    getAllInsurance = () => {

    }
    
    handleChange = (event) => {
        const name = event.target.name
        this.setState({ [name]: event.target.value });
    }



    logout = () => {
        this.props.history.push({
            pathname: '/login'
        })
    }

    render() {
        var inputStyle = {
            paddingLeft: "10px",
            border: "1px solid",
            borderRadius: "5px",
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

                </div>
            );
        }
    }
}
