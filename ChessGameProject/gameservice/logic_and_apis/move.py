from flask_restful import Resource
from flask import request
from jsonschema import validate

from database_access.gameInstance import (
    get_game_instance_by_id,
    make_move,
    FINAL_STATUS,
    ACCEPTED_STATUS
)
from database_access.user import get_user_by_id
from database_access.move import make_move_entry,get_moves_by_game_id
from database_access.session import get_session

from logic_and_apis.chess_game import ChessGame


class Move(Resource):

    def __init__(self):
        self.schema = {
            "type" : "object",
            "properties" : {
                "game_id" : {"type" : "string"},
                "pstate" : {
                    "type" : "array",
                    "items" : {
                        "type" : "array",
                        "items" : {"type" : "string" }
                    }
                }
            }
        }

    def __validate_move_obj(self,payload):
        try:
            validate(payload,self.schema)
            return True
        except:
            return False

    def __single(self,move):
        return{
            "move_id" : str(move["_id"]),
            "game_id" : move["game_id"],
            "prev_state" : move["prev_state"],
            "curr_state" : move["curr_state"],
            "next_player" : move["next_player"]
        }

    
    def __multiple(self,moves):
        return [self.__single(move) for move in moves]
    
    def __singleGame(self,game_object):
        return {
            "player1" :game_object["player1"],
            "player2" :game_object["player2"],
            "game_id" : str(game_object["_id"]),
            "cstate" : game_object["cstate"],
            "winner" : game_object["winner"],
            "status" : game_object["status"],
            "next_player" : game_object["next_player"]
        }
    
    def get(self):
        params = request.args.to_dict()
        session = get_session(params['token'])
        if not session :
            return {
                "response" : None,
                "messege" : "UnAuthorized",
                "status" : False
            },401
        current_user_id = str(session['user'])
        if current_user_id:
            user = get_user_by_id(current_user_id)
            if not user:
                return {
                    "response" : None,
                    "messege" : "user not found",
                    "status": False
                }, 404 

        game_id = params["game_id"]
        moves = get_moves_by_game_id(game_id)
        return {
            "response" : self.__multiple(moves), 
            "messege" : "All Moves",
            "status" :True
        },200
    
    def post(self):
        params = request.args.to_dict()
        session = get_session(params['token'])
        if not session :
            return {
                "response" : None,
                "messege" : "UnAuthorized",
                "status" : False
            },401
        current_user_id = str(session['user'])
        if current_user_id:
            user = get_user_by_id(current_user_id)
            if not user:
                return {
                    "response" : None,
                    "messege" : "user not found",
                    "status": False
                }, 404 
        
        payload = request.json
        if not self.__validate_move_obj(payload):
            return {
                "response" : None,
                "messege" : "Bad request",
                "status": False
            }, 401

        game_id = payload['game_id']
        proposed_state = payload['pstate']
        game_instance = get_game_instance_by_id(game_id)

        if not game_instance :
            return {
                "response" : None,
                "messege" : "Game Instance not found",
                "status" :False
            }, 404
        
        if game_instance["status"] == FINAL_STATUS:
            return {
                "response" : game_instance["cstate"],
                "messege" : "Game Over",
                "status" :False
            }, 400
        piece_type = "WHITE"
        next_player = game_instance["player1"]
        
        if game_instance["player1"]["player_id"] == current_user_id:
            piece_type = game_instance["player1"]["piece_type"]
            next_player = game_instance["player2"]
            if game_instance["next_player"]["piece_type"] != game_instance["player1"]["piece_type"]:
                return {
                    "response" : game_instance["cstate"],
                    "messege" : "Not Your Turn",
                    "status" : False
                },401
        elif game_instance["player2"]["player_id"] == current_user_id:
            piece_type = game_instance["player2"]["piece_type"]
            next_player = game_instance["player1"]
            if game_instance["next_player"]["piece_type"] != game_instance["player2"]["piece_type"]:
                return {
                    "response" : game_instance["cstate"],
                    "messege" : "Not Your Turn",
                    "status" : False
                },401
        else:
            return {
                "response" : game_instance["cstate"],
                "messege" : "You are Not player in this game",
                "status" : False
            },401

        curr_game = ChessGame()
        curr_game.assignNewStateValue(game_instance["cstate"])
        print(curr_game)

        ppos_game = ChessGame()
        ppos_game.assignNewStateValue(proposed_state)
        print(ppos_game)

        success = curr_game.isValidMove(ppos_game,piece_type)
        if not success :
            return {
                "response" : game_instance["cstate"],
                "messege" : "Invalid Move", 
                "status" : False
            },401

        isgameover = ppos_game.isGameOver()
        if isgameover :
            make_move(game_id,ppos_game.state,None,FINAL_STATUS,winner=game_instance["next_player"])
        else :
            make_move(game_id,ppos_game.state,next_player,ACCEPTED_STATUS)

        make_move_entry(game_id,curr_game.state,ppos_game.state,game_instance["next_player"],next_player)
        game_instance = get_game_instance_by_id(game_id)
        if game_instance["status"] == FINAL_STATUS:
            return {
                "response" : self.__singleGame(game_instance),
                "messege" : "You Win",
                "status" : True
            },200
        return {
            "response" : self.__singleGame(game_instance),
            "messege" : "You Played successfully",
            "status" : True
        },200