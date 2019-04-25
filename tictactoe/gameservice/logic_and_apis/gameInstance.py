from flask_restful import Resource
from flask import request
from jsonschema import validate
import random

from database_access.gameInstance import (
    create_game_instance,
    get_game_instance_by_id,
    get_all_challenged_games,
    get_all_game_challenges,
    get_all_win_games,
    get_all_loose_games,
    get_all_playable_games,
    accepte_game_instance,
    get_all_finished_games,
    all_games,
)
from database_access.user import get_user_by_id ,get_user_by_mail
from database_access.session import get_session

class GameInstance(Resource):
    def __init__(self):
        self.schema = {
            "type" : "object",
            "properties" : {
                "email" : {"type" : "string"}
            }
        }

    def __validate_game_instance_creation(self,payload):
        try:
            validate(payload,self.schema)
            return True
        except:
            return False


    def __single(self,game_object):
        return {
            "player1" :game_object["player1"],
            "player2" :game_object["player2"],
            "game_id" : str(game_object["_id"]),
            "cstate" : game_object["cstate"],
            "winner" : game_object["winner"],
            "status" : game_object["status"],
            "next_player" : game_object["next_player"]
        }

    def __single_basic(self,game_object):
        return {
            "game_id" : str(game_object["_id"]),
            "winner" : game_object["winner"],
            "status" : game_object["status"]
        }

    def __multiple(self,game_objects):
        return [ self.__single(game_object) for game_object in game_objects ]

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
        
        reqtype = params['type']
        if reqtype == "ID":
            game_id = params['id']
            game = get_game_instance_by_id(game_id)
            print (game)
            if not game:
                return {
                    "response" : None,
                    "messege":"Game not found",
                    "status":False
                },404
            return {
                "response" : self.__single(game),
                "messege":"ok",
                "status":True
            },200
        elif reqtype == "CHALLENGES":
            games = get_all_game_challenges(current_user_id)
            return {
                "response" : self.__multiple(games),
                "messege":"all game challenges ok",
                "status":True
            },200
        elif reqtype == "CHALLENGED":
            games = get_all_challenged_games(current_user_id)
            return {
                "response" : self.__multiple(games),
                "messege":"all challenged games ok",
                "status":True
            },200
        elif reqtype == "WINS":
            games = get_all_win_games(current_user_id)
            # print (games)
            return {
                "response" : self.__multiple(games),
                "messege":"all win games ok",
                "status":True
            },200
        elif reqtype == "LOOSES":
            games = get_all_loose_games(current_user_id)
            # print (games)
            return {
                "response" : self.__multiple(games),
                "messege":"all loose games ok",
                "status":True
            },200
        elif reqtype == "FINISHED":
            games = get_all_finished_games(current_user_id)
            # print (games)
            return {
                "response" : self.__multiple(games),
                "messege":"all finished games ok",
                "status":True
            },200
        elif reqtype == "PLAYABLE":
            games = get_all_playable_games(current_user_id)
            # print (games)
            return {
                "response" : self.__multiple(games), 
                "messege":"user playable games ok", 
                "status" :True 
            }, 200


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
        user1 = get_user_by_id(current_user_id)
        if not user1:
            return {
                "response" : None,
                "messege" : "user not found",
                "status": False
            }, 404 

        payload = request.json
        if not self.__validate_game_instance_creation(payload):
            return {
                "response" : None,
                "messege" : "Bad request",
                "status" : False
            },404
        
        player2_email = payload['email']
        user2 = get_user_by_mail(player2_email)
        if not user2:
            return {
                    "response" : None,
                    "messege" : "user not found by email",
                    "status": False
                }, 404 
        
        player1 ={
            "player_id":str(user1["_id"]),
            "email":user1["email"],
            "name" :user1["name"],
            "piece_type": "O"
        }
        player2 ={
            "player_id":str(user2["_id"]),
            "email":user2["email"],
            "name" :user2["name"],
            "piece_type": "X"
        } 
        tossNo = random.choice([1,2])
        tossWinner = player1
        if tossNo == 2:
            tossWinner = player2
        game_instance_id = create_game_instance(player1,player2,tossWinner)

        game_single = self.__single(get_game_instance_by_id(game_instance_id))
        # print(game_single)
        return {
            "response" : game_single , 
            "messege" : "game created successfully",
            "status" : True
        },200

    def patch(self):
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

        game_id = payload['game_id']
        game = get_game_instance_by_id(game_id)
        if current_user_id != game["player2"]["player_id"]:
            return{
                "response" : None , 
                "messege" : "You are not allowed to accept challenge on behalf of other",
                "status" : False
            },400
        accepte_game_instance(game_id)
        return{
            "response" : None , 
            "messege" : "Challenge Accepted Successfully",
            "status" : True
        },200
