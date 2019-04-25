import React, { Component } from "react";
import { DOMAIN } from '../constants/constants';
import Chess from 'react-chess';

export function Make_move(body, token) {
    return fetch(DOMAIN + `chessGame/move/?token=${token}`, {
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
    return fetch(DOMAIN + `chessGame/user/?token=${token}`, {
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
    return fetch(DOMAIN + `chessGame/gameinstance/?type=ID&&id=${game_id}&&token=${token}`, {
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

export default class ChessGame extends Component {
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
            chessBoardlineup:[],
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
                },()=>{this.setGameState(result.response.cstate)})
            }else{
                console.log(result.messege)
            }
        })
    }

    setGameState = (gameState) => {
        this.setState({
            gameState : gameState,
            chessBoardlineup : []
        },() =>{
            this.convertbackstatetolineUp()
        })
    }

    afterpieceMoved = (piece,fromSqure,toSqure) => {
        if (this.state.gameState !== undefined &&
            this.state.gameState !== null &&
            this.state.gameState !== []){

            var gameState = this.state.gameState
            gameState[8-parseInt(toSqure[1])][toSqure.charCodeAt(0)-97] = piece.name //to squre value
            gameState[8-parseInt(fromSqure[1])][fromSqure.charCodeAt(0)-97] = '-'
            this.setState({gameState:gameState})
            this.makemove()
        }
    }

    convertbackstatetolineUp = () =>{
        if (this.state.gameState !== undefined &&
            this.state.gameState !== null &&
            this.state.gameState !== []){

            for (var i = 0; i<8; i++){
                for (var j = 0; j<8; j++){
                    if (this.state.gameState[i][j] !== '-'){
                        var goti = this.state.gameState[i][j] + '@' + String.fromCharCode(j+97) +String(8-i)
                        this.state.chessBoardlineup.push(goti)
                    }
                    if(i===7 && j === 7){
                        this.setState({loading : false})
                    }
                }
            }
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
                },()=>{this.setGameState(result.response.cstate)})
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
                            {this.state.game.winner === null &&
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
                    <div className="col-sm-5" style={{marginTop:"20px"}}>
                        <Chess 
                            pieces={this.state.chessBoardlineup} 
                            onMovePiece={this.afterpieceMoved}
                        /> 
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