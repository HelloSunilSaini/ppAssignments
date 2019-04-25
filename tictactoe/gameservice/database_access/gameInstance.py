from pymongo import MongoClient
from bson import ObjectId
from logic_and_apis.tic_tac_toe import TicTacToe 

t = TicTacToe()

client = MongoClient()
db = client.tictactoe_game

ginstancecltn = db.game_instance

FINAL_STATUS = "GAMEOVER"
ACCEPTED_STATUS = "ACCEPTED"
START_STATUS = "CHALLENGED"

def create_game_instance(player1,player2,tosswinner):
    instance_object = {
        "cstate" : t.state,
        "status" : START_STATUS,
        "next_player" : tosswinner,
        "player1":player1,
        "player2":player2,
        "winner" : None
    }
    gi = ginstancecltn.insert_one(instance_object)
    return gi.inserted_id


def get_game_instance_by_id(game_id):
    return ginstancecltn.find_one({"_id" : ObjectId(game_id)})

def accepte_game_instance(game_obj_id):
    ginstancecltn.update_one(
        {"_id" : ObjectId(game_obj_id)}, 
        {"$set" : { "status" : ACCEPTED_STATUS } })

def make_move(game_obj_id, new_state, next_player, new_status, winner = None):
    ginstancecltn.update_one(
        {"_id" : ObjectId(game_obj_id)}, 
        {"$set" : 
            {  "cstate" : new_state,
               "status" : new_status,
               "next_player" : next_player,
               "winner" : winner}
        }
    )

def get_all_game_challenges(user_id):
    return list(ginstancecltn.find({"player2.player_id" : user_id , "status" : START_STATUS}))
 
def get_all_challenged_games(user_id):
    return list(ginstancecltn.find({"player1.player_id" : user_id , "status" : START_STATUS}))

def get_all_playable_games(user_id):
	l1 = list(ginstancecltn.find({"player1.player_id" : user_id , "status" : ACCEPTED_STATUS}))
	l2 = list(ginstancecltn.find({"player2.player_id" : user_id , "status" : ACCEPTED_STATUS}))
	return l1 + l2

def get_all_finished_games(user_id):
	l1 = list(ginstancecltn.find({"player1.player_id" : user_id , "status" : FINAL_STATUS}))
	l2 = list(ginstancecltn.find({"player2.player_id" : user_id , "status" : FINAL_STATUS}))
	return l1 + l2

def get_all_win_games(user_id):
	all_finished_games = get_all_finished_games(user_id)
	all_win_games = []
	for i in all_finished_games:
		if user_id == i.winner["player_id"]:
			all_win_games.append(i)
	return all_win_games

def get_all_loose_games(user_id):
	all_finished_games = get_all_finished_games(user_id)
	all_loose_games = []
	for i in all_finished_games:
		if user_id != i.winner["player_id"]:
			all_loose_games.append(i)
	return all_loose_games


def all_games(user_id):
    return list(ginstancecltn.find({"player1.player_id" : user_id ,"status" : START_STATUS}))