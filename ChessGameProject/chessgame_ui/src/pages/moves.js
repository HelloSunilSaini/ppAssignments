import React, { Component } from "react";
import { DOMAIN } from '../constants/constants';
import Chess from 'react-chess';

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

export function GetAllMoves(game_id,token){
    return fetch(DOMAIN + `chessGame/move/?game_id=${game_id}&&token=${token}`, {
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

export default class Moves extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            userName:"",
            userEmail:"",
            game_id : this.props.location.state.game.game_id,
            game : this.props.location.state.game,
            gameState : this.props.location.state.gameState,
            prev_state : [],
            curr_state : [],
            curr_player : {},
            next_player : {},
            allMoves : [],
            totalMoves: 0,
            index : 0,
            token : this.props.location.state.token,
            chessBoardlineup : [],
            chessBoardlineup1 : [],
            chessBoardlineup2 : [],
        }
    }

    componentDidMount(){
        this.getGame()
        GetUser(this.state.token).then(result => {
            if(result.status){
                this.setState({
                    userName : result.response.name,
                    userEmail: result.response.email,
                })
            }else{
                console.log(result.messege)
            }
        })
        GetAllMoves(this.state.game_id,this.state.token).then(result => {
            if(result.status){
                console.log(result.messege)
                console.log(result.response)
                this.setState({
                    allMoves : result.response,
                    totalMoves : result.response.length,
                    index : 0
                },()=>{
                    this.setMove()
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
        this.setGameState(this.state.gameState)
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

    setPrevState = (prev_state) =>{
        this.setState({
            prev_state : prev_state,
            chessBoardlineup1 : []
        },()=>{
            this.convertbackstatetolineUp1()
        })
    }

    afterpieceMoved1 = (piece,fromSqure,toSqure) => {
        this.setPrevState(this.state.prev_state)
    }

    convertbackstatetolineUp1 = () =>{
        if (this.state.prev_state !== undefined &&
            this.state.prev_state !== null &&
            this.state.prev_state !== []){

            for (var i = 0; i<8; i++){
                for (var j = 0; j<8; j++){
                    if (this.state.prev_state[i][j] !== '-'){
                        var goti = this.state.prev_state[i][j] + '@' + String.fromCharCode(j+97) +String(8-i)
                        this.state.chessBoardlineup1.push(goti)
                    }
                    if(i===7 && j === 7){
                        this.setState({loading : false})
                    }
                }
            }
        }
    }

    setCurrState = (curr_state) => {
        this.setState({
            curr_state : curr_state,
            chessBoardlineup2 : []
        },()=>{
            this.convertbackstatetolineUp2()
        })
    }


    afterpieceMoved2 = (piece,fromSqure,toSqure) => {
        this.setCurrState(this.state.curr_state)
    }

    convertbackstatetolineUp2 = () =>{
        if (this.state.curr_state !== undefined &&
            this.state.curr_state !== null &&
            this.state.curr_state !== []){

            for (var i = 0; i<8; i++){
                for (var j = 0; j<8; j++){
                    if (this.state.curr_state[i][j] !== '-'){
                        var goti = this.state.curr_state[i][j] + '@' + String.fromCharCode(j+97) +String(8-i)
                        this.state.chessBoardlineup2.push(goti)
                    }
                    if(i===7 && j === 7){
                        this.setState({loading : false})
                    }
                }
            }
        }
    }

    setMove = () =>{
        if(this.state.totalMoves !== 0){
            this.setState({
                curr_player : this.state.allMoves[this.state.index].curr_player,
                next_player : this.state.allMoves[this.state.index].next_player
            },()=>{
                this.setCurrState(this.state.allMoves[this.state.index].curr_state)
                this.setPrevState(this.state.allMoves[this.state.index].prev_state)
            })
        }
    }

    prevMove = () => {
        if(this.state.totalMoves !== 0 
            && this.state.index > 0)
        {
            this.setState({index : (this.state.index-1)},this.setMove())
        }
    }

    nextMove = () => {
        if(this.state.totalMoves !== 0 
            && this.state.index < (this.state.totalMoves-1))
        {
            this.setState({index : (this.state.index+1)},this.setMove())
        }
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
                    <div className="col-sm-3" style={{marginTop:"10px"}}>
                            <div style={{marginLeft:"10px",marginTop:"10px"}}> <b>user name : </b>{this.state.userName}</div>
                            <div style={{marginLeft:"10px"}}> <b>user email : </b>{this.state.userEmail}</div>
                            <button
                                className="btn btn-link"
                                onClick={this.gotoUserPage}
                            >
                                Back To User Details
                            </button>
                            <div style={{marginLeft:"10px"}}>
                                <div style={{fontSize:"20px",margin:"10px",fontWeight:"bold"}}>Player(s) Details</div>
                                <div style={{fontWeight:"bold"}}> Player1 : </div>
                                <div> {this.state.game.player1.name} ({this.state.game.player1.email})</div>
                                <div> Piece : {this.state.game.player1.piece_type}</div>
                                <div style={{fontWeight:"bold",marginTop:"20px"}}> Player2 : </div>
                                <div> {this.state.game.player2.name} ({this.state.game.player2.email})</div>
                                <div> Piece : {this.state.game.player2.piece_type}</div>
                            </div>
                    </div>  
                    <div className="col-sm-6" style={{marginTop:"20px"}}>
                        <div className="row">
                            <div className="col-sm-6">
                            <Chess 
                                pieces={this.state.chessBoardlineup1} 
                                onMovePiece={this.afterpieceMoved1}
                            />
                            </div>
                            <div className="col-sm-6">
                            <Chess 
                                pieces={this.state.chessBoardlineup2} 
                                onMovePiece={this.afterpieceMoved2}
                            />
                            </div>
                        </div>
                        <div>
                            <div className="row">
                                <button
                                    type="button"
                                    className="btn btn-link col-sm-6"
                                    onClick={this.prevMove}
                                >
                                    Prev
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-link col-sm-6"
                                    onClick={this.nextMove}
                                >
                                    Next
                                </button>
                            </div>
                            {this.state.curr_player !== {} && this.state.curr_player !== undefined && this.state.curr_player !== null &&
                                <div>
                                    Player Who Played This Move : {this.state.curr_player.name} ({this.state.curr_player.email})
                                </div>
                            }
                        </div>
                    </div>
                    <div className="col-sm-3" style={{marginTop:"10px"}}>

                            <div style={{fontSize:"20px",margin:"5px",marginTop:"20px",fontWeight:"bold"}}>Game Details</div>
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
                            <div 
                                style={{
                                    fontWeight:"bold",
                                    marginTop:"10px",
                                    marginBottom:"5px",
                                }}
                            > 
                                Final Game State:
                            </div>
                            <Chess 
                                pieces={this.state.chessBoardlineup} 
                                onMovePiece={this.afterpieceMoved}
                            />
                    </div> 
                </div>
            );
        }
        else{
            return <center style={{marginTop : "300px"}}> Loading... </center>
        }
    }
}