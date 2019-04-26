import React, { Component } from "react";
import { DOMAIN } from '../constants/constants';
import TicTacToeBoard from './tictactoe_board';

export function Make_move(body, token) {
    return fetch(DOMAIN + `tictactoe/move/?token=${token}`, {
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

export function GetGameById(game_id,token){
    return fetch(DOMAIN + `tictactoe/gameinstance/?type=ID&&id=${game_id}&&token=${token}`, {
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

export default class TicTacToe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            userId : "",
            userName:"",
            userEmail:"",
            game_id : this.props.location.state.game.game_id,
            game : this.props.location.state.game,
            gameState : this.props.location.state.gameState,
            token : this.props.location.state.token
        }
    }

    componentDidMount(){
        this.getGame()
        GetUser(this.state.token).then(result => {
            if(result.status){
                this.setState({
                    userId : result.response.userId,
                    userName : result.response.name,
                    userEmail: result.response.email,
                    loading : false
                })
            }else{
                console.log(result.messege)
            }
        })
    }

    getGame = () => {
        GetGameById(this.state.game_id,this.state.token).then(result =>{
            if(result.status){
                this.setState({
                    game : result.response,
                    gameState : result.response.cstate
                })
            }else{
                console.log(result.messege)
            }
        })
        setTimeout(() => {this.getGame()},5000);
    }

    onMove = (x,y) => {
        if (this.state.game.winner !== null || this.state.game.status === "GAMEOVER"){
            alert("Game is Over")
        }
        else if (this.state.game.next_player.player_id !== this.state.userId){
            alert("Not Your Turn")
        }
        else if (this.state.gameState !== undefined &&
            this.state.gameState !== null &&
            this.state.gameState !== []){
            
            var gameState = this.state.gameState
            gameState[parseInt(x)][parseInt(y)] = this.state.game.next_player.piece_type
            this.setState({gameState : gameState})
            this.makemove()
        }
    }

    makemove= () => {
        var body = JSON.stringify({
            game_id: this.state.game.game_id,
            pstate: this.state.gameState
        })
        Make_move(body,this.state.token).then(result => {
            if (result.status){
                console.log(result.response)
                console.log(result.messege)
                this.setState({
                    game : result.response,
                    gameState : result.response.cstate
                })
            }else{
                alert(result.messege)
                this.getGame()
                console.log(result.messege)
            }
        })
    }

    gotoUserPage = () => {
        this.props.history.push({
            pathname: '/user',
            state: {
                token: this.state.token,
            }
        })
    }

    render() {
        if (this.state.loading === false){
            return (
                <div className="row" style={{width:"100%"}}>
                    <div className="col-sm-3" style={{marginTop:"10px",marginLeft:"10px"}}>
                            <div style={{marginLeft:"10px",marginTop:"10px"}}> <b>user name : </b>{this.state.userName}</div>
                            <div style={{marginLeft:"10px"}}> <b>user email : </b>{this.state.userEmail}</div>
                            <button
                                className="btn btn-link"
                                onClick={this.gotoUserPage}
                            >
                                Back To User Details
                            </button>

                            <div style={{fontSize:"20px",margin:"10px",marginTop:"20px",fontWeight:"bold"}}>Game Details</div>
                            <div style={{fontWeight:"bold"}}> Game Id :</div>
                            <div>{this.state.game.game_id}</div>
                            {this.state.game.next_player !== null && this.state.game.next_player !== undefined &&
                                <div>
                                    <div style={{fontWeight:"bold"}}> Next Player : </div>
                                    <div> {this.state.game.next_player.name} ({this.state.game.next_player.email})</div>
                                </div>
                            }
                            {this.state.game.winner !== null &&
                                <div>
                                    <div style={{fontWeight:"bold"}}> Winner : </div>
                                    <div>{this.state.game.winner.name} ({this.state.game.winner.email})</div>
                                </div>
                            }
                    </div>  
                    <div className="col-sm-5">
                        <div style={{marginLeft:"50px",marginTop:"50px"}}>
                            <TicTacToeBoard
                                height="120px" 
                                width="120px" 
                                fontSize="80px"
                                gameState={this.state.gameState}
                                onMove={this.onMove}
                            />
                        </div>
                    </div>
                    <div className="col-sm-3" style={{marginTop:"10px"}}>
                            <div style={{fontSize:"20px",margin:"10px",fontWeight:"bold"}}>Player(s) Details</div>
                            <div style={{fontWeight:"bold"}}> Player1 : </div>
                            <div> {this.state.game.player1.name} ({this.state.game.player1.email})</div>
                            <div> Piece : {this.state.game.player1.piece_type}</div>
                            <div style={{fontWeight:"bold",marginTop:"20px"}}> Player2 : </div>
                            <div> {this.state.game.player2.name} ({this.state.game.player2.email})</div>
                            <div> Piece : {this.state.game.player2.piece_type}</div>
                    </div> 
                </div>
            );
        }
        else{
            return <center style={{marginTop : "300px"}}> Loading... </center>
        }
    }
}