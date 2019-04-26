import React, { Component } from "react";
// import ReactTable from "react-table";
import "react-table/react-table.css";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { DOMAIN } from '../constants/constants';

export function DropDown(props = { name: "", value: [], default: "" }) {
    const mappingFunction = p => <option key={p} value={p}>{p}</option>;
    return (
        <div>
            <select
                className="custom-select"
                style={{ width: "225px" }}
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

export function GetUser(token) {
    return fetch(DOMAIN + `tictactoe/user/?token=${token}`, {
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

export function Logout(token) {
    return fetch(DOMAIN + `tictactoe/uservalidation/?token=${token}`, {
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

export function Challenge_by_mail(body, token) {
    return fetch(DOMAIN + `tictactoe/gameinstance/?token=${token}`, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Content-Type': 'application/json',
        },
        body: body
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

export function Accept_challenge(body,token){
    return fetch(DOMAIN + `tictactoe/gameinstance/?token=${token}`, {
        method: 'PATCH',
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Content-Type': 'application/json',
        },
        body: body
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

export function Get_all_challenges(token) {
    return fetch(DOMAIN + `tictactoe/gameinstance/?type=CHALLENGES&&token=${token}`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin' : '*',
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

export function Get_all_challenged(token) {
    return fetch(DOMAIN + `tictactoe/gameinstance/?type=CHALLENGED&&token=${token}`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin' : '*',
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

export function Get_all_wins(token) {
    return fetch(DOMAIN + `tictactoe/gameinstance/?type=WINS&&token=${token}`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin' : '*',
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

export function Get_all_looses(token) {
    return fetch(DOMAIN + `tictactoe/gameinstance/?type=LOOSES&&token=${token}`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin' : '*',
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

export function Get_all_Playable(token) {
    return fetch(DOMAIN + `tictactoe/gameinstance/?type=PLAYABLE&&token=${token}`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin' : '*',
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

export function Get_all_finished(token) {
    return fetch(DOMAIN + `tictactoe/gameinstance/?type=FINISHED&&token=${token}`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin' : '*',
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


export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: this.props.location.state.token,
            userId: "",
            name: "",
            email: "",
            AllChallenged : [],
            AllChallenges : [],
            AllPlayable : [],
            AllFinishedGames : [],
            OtherEmail : '',
            Game_id : '',
        };
    }

    componentDidMount() {
        this.getUserDetails()
        this.getAllChallenged()
        this.getAllChallenges()
        this.getAllFinishedGames()
        this.getAllPlayable()

        setTimeout(() => {this.componentDidMount()},10000);
    }

    handleChange = (event) => {
        const name = event.target.name
        this.setState({ [name]: event.target.value });
    }

    getUserDetails = () => {
        GetUser(this.state.token).then(result => {
            if (result.status) {
                console.log(result.messege)
                this.setState({
                    userId: result.response.userId,
                    name: result.response.name,
                    email: result.response.email,
                    loading : false,
                })
            } else {
                console.log(result.messege)
            }
        })
    }

    getAllFinishedGames = () =>{
        Get_all_finished(this.state.token).then(result =>{
            if (result.status){
                console.log(result.messege)
                this.setState({
                    AllFinishedGames : result.response,
                    loading1 : false,
                })
            }else{
                console.log(result.messege)
            }
        })
    }

    getAllChallenges = () =>{
        Get_all_challenges(this.state.token).then(result =>{
            if(result.status){
                console.log(result.messege)
                this.setState({
                    AllChallenges : result.response,
                    loading2 : false,
                })
            }else{
                console.log(result.messege)
            }
        })
    }

    getAllChallenged = () => {
        Get_all_challenged(this.state.token).then(result =>{
            if(result.status){
                console.log(result.messege)
                this.setState({
                    AllChallenged : result.response,
                    loading3 : false,
                })
            }else{
                console.log(result.messege)
            }
        })
    }

    getAllPlayable = () =>{
        Get_all_Playable(this.state.token).then(result =>{
            if(result.status){
                console.log(result.messege)
                this.setState({
                    AllPlayable : result.response,
                    loading4 : false,
                })
            }else{
                console.log(result.messege)
            }
        })
    }

    AcceptChallenge = (game_id) =>{
        var body = JSON.stringify({game_id : game_id})
        Accept_challenge(body,this.state.token).then(result => {
            if(result.status){
                alert(result.messege)
                this.getAllChallenges()
                this.getAllPlayable()
            }else{
                alert(result.messege)
            }
        })
    }

    challengeByEmail = () => {
        var body = JSON.stringify({email : this.state.OtherEmail})
        Challenge_by_mail(body,this.state.token).then(result =>{
            if(result.status){
                alert(result.messege)
                this.getAllChallenged()
            }else{
                alert(result.messege)
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

    gotoChessPage = (game) => {
        this.props.history.push({
            pathname: '/tictactoe',
            state: {
                gameState: game.cstate,
                token: this.state.token,
                game:game
            }
        })
    }

    gotoMovePage = (game) => {
        this.props.history.push({
            pathname: '/moves',
            state: {
                gameState: game.cstate,
                token: this.state.token,
                game:game
            }
        })
    }

    gotoLoginPage = () => {
        this.props.history.push({
            pathname: '/login'
        })
    }

    renderChallenge = (c) => {
        return(
            <tr key={c.game_id}>
                <div className="row" style={{marginLeft:"30px"}}>
                    <div style={{marginLeft:"20px"}}>
                        ---- game [ {c.game_id} ] ---- {c.player1.name} [ {c.player1.email} ] ---- challenged you ----  
                    </div>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {this.AcceptChallenge(c.game_id)}}
                        style={{
                            marginLeft:"30px",
                            height:"30px",
                            paddingTop:"1px",
                            paddingLeft:"5px",
                            paddingBottom:"1px",
                            paddingRight:"5px"
                        }}
                    >
                        Accept
                    </button>   
                </div>
            </tr>
        )
    }

    renderPendingChallenge = (pc) => {
        return(
            <tr key={pc.game_id} >
                <div style={{marginLeft:"30px"}}>
                    ----  game [ {pc.game_id} ]  ----  you  challenged  ----  
                    <b> {pc.player2.name} ( {pc.player2.email} ) </b> ---- 
                </div>
            </tr>
        )
    }

    renderWinsAndLooses = (wl) => {
        return(
            <tr key={wl.game_id}>
                <div className="row">
                    <div style={{marginLeft:"30px"}}>
                        <div>
                            ---- game [ {wl.game_id} ] ---- palyers [ {wl.player1.name} 
                            ({wl.player1.email}), {wl.player2.name}({wl.player2.email}) ]
                        </div>
                        <div>
                            {wl.winner !== null && wl.winner !== undefined &&
                            <div>---- Winner [ {wl.winner.name}({wl.winner.email}) ] </div>
                            }
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-info"
                        style={{
                            marginLeft:"30px",
                            height:"30px",
                            paddingTop:"1px",
                            paddingLeft:"5px",
                            paddingBottom:"1px",
                            paddingRight:"5px"
                        }}
                        onClick={() => {this.gotoMovePage(wl)}}
                    >
                        Details
                    </button>
                </div>
            </tr>
        )
    }

    renderPlayable = (p) => {
        return(
            <tr key={p.game_id}>
                <div className="row">
                    <div style={{marginLeft:"30px"}}>
                        ---- game [ {p.game_id} ] ---- palyers [ {p.player1.name} 
                        ({p.player1.email}), {p.player2.name}({p.player2.email}) ]
                    </div>
                    <button
                        type="button"
                        className="btn btn-success"
                        style={{
                            marginLeft:"30px",
                            height:"30px",
                            paddingTop:"1px",
                            paddingLeft:"5px",
                            paddingBottom:"1px",
                            paddingRight:"5px"
                        }}
                        onClick={() => {this.gotoChessPage(p)}}
                    >
                        Play
                    </button>
                </div>
            </tr>
        )
    }

    render() {
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
            // console.log(this.state)
            return (
                <div style={{ width: "100%" }}>
                    <Tabs>
                        <div >
                            <div
                                className="row"
                                style={{ marginLeft: "10px", marginTop: "20px" }}
                            >
                                <div className="col-sm-4">
                                    <div className="row">
                                        <b>Your Name : </b> {this.state.name}
                                    </div>
                                    <div className="row">
                                        <b>Your Email : </b> {this.state.email}
                                    </div>
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
                                <div className="col-sm-6">
                                    <div className="row">
                                        Email : 
                                        <input 
                                            type="text" 
                                            name="OtherEmail"
                                            style={{
                                                marginLeft:"10px",
                                                border:"1px solid",
                                                borderRadius : "5px",
                                                paddingLeft:"5px",
                                                height:"25px",
                                                width:"300px"
                                            }}
                                            onChange={this.handleChange}
                                        >
                                        </input>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            style={{
                                                marginLeft:"20px",
                                                height:"30px",
                                                paddingTop:"1px",
                                                paddingLeft:"5px",
                                                paddingBottom:"1px",
                                                paddingRight:"5px"
                                            }}
                                            onClick={this.challengeByEmail}
                                        >
                                            Challenge
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <TabList style={{ margin: "10px" }} >
                                <Tab>Challenges</Tab>
                                <Tab>Game(s) You can Play</Tab>
                                <Tab>Challenges You made (pending)</Tab>
                                <Tab>Wins and Looses</Tab>
                            </TabList>
                        </div>
                        <TabPanel>
                            <div>
                                <table>
                                    <tbody>
                                        {this.state.AllChallenges.map(this.renderChallenge)}
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div>
                                <table>
                                    <tbody>
                                        {this.state.AllPlayable.map(this.renderPlayable)}
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div>
                                <table>
                                    <tbody>
                                            {this.state.AllChallenged.map(this.renderPendingChallenge)}
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div>
                                <table>
                                    <tbody>
                                        {this.state.AllFinishedGames.map(this.renderWinsAndLooses)}
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>
                    </Tabs>
                </div>
            );
        }
    }
}
