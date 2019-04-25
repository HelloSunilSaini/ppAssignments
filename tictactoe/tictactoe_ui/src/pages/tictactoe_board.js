import React, { Component } from "react";

export default class TicTacToeBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            gameState: this.props.gameState,
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.gameState !== this.props.gameState){
            this.componentDidMount()
        }
    }

    componentDidMount() {
        this.setState({gameState : this.props.gameState})
    }

    render() {
        var height = this.props.height
        var width = this.props.width
        var fontSize = this.props.fontSize
        const OddBoxStyle ={
            width: width,
            height: height,
            backgroundColor: "#e9caa4",
            color: "Black",
            fontSize: fontSize,
            fontWeight: "bold",
            border: "0px solid"
        }
        const EvenBoxStyle ={
            width: width,
            height: height,
            backgroundColor: "#bb823d",
            color: "white",
            fontSize: fontSize,
            fontWeight: "bold",
            border: "0px solid"
        }
        return (
            <div style={{width:"100%",height:"100%"}}>
                <div className="row">
                    <button
                        type="button"
                        style={OddBoxStyle}
                        onClick={()=>{this.props.onMove(0,0)}}
                    >
                        {this.state.gameState[0][0] !== "-" &&
                            this.state.gameState[0][0]
                        }
                    </button>
                    <button
                        type="button"
                        style={EvenBoxStyle}
                        onClick={()=>{this.props.onMove(0,1)}}
                    >
                        {this.state.gameState[0][1] !== "-" &&
                            this.state.gameState[0][1]
                        }
                    </button>
                    <button
                        type="button"
                        style={OddBoxStyle}
                        onClick={()=>{this.props.onMove(0,2)}}
                    >
                        {this.state.gameState[0][2] !== "-" &&
                            this.state.gameState[0][2]
                        }
                    </button>
                </div>
                <div className="row">
                    <button
                        type="button"
                        style={EvenBoxStyle}
                        onClick={()=>{this.props.onMove(1,0)}}
                    >
                        {this.state.gameState[1][0] !== "-" &&
                            this.state.gameState[1][0]
                        }
                    </button>
                    <button
                        type="button"
                        style={OddBoxStyle}
                        onClick={()=>{this.props.onMove(1,1)}}
                    >
                        {this.state.gameState[1][1] !== "-" &&
                            this.state.gameState[1][1]
                        }
                    </button>
                    <button
                        type="button"
                        style={EvenBoxStyle}
                        onClick={()=>{this.props.onMove(1,2)}}
                    >
                        {this.state.gameState[1][2] !== "-" &&
                            this.state.gameState[1][2]
                        }
                    </button>
                </div>
                <div className="row">
                    <button
                        type="button"
                        style={OddBoxStyle}
                        onClick={()=>{this.props.onMove(2,0)}}
                    >
                        {this.state.gameState[2][0] !== "-" &&
                            this.state.gameState[2][0]
                        }
                    </button>
                    <button
                        type="button"
                        style={EvenBoxStyle}
                        onClick={()=>{this.props.onMove(2,1)}}
                    >
                        {this.state.gameState[2][1] !== "-" &&
                            this.state.gameState[2][1]
                        }
                    </button>
                    <button
                        type="button"
                        style={OddBoxStyle}
                        onClick={()=>{this.props.onMove(2,2)}}
                    >
                        {this.state.gameState[2][2] !== "-" &&
                            this.state.gameState[2][2]
                        }
                    </button>
                </div>
            </div>
        );
    }
}