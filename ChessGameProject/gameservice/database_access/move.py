from pymongo import MongoClient
from bson import ObjectId

client = MongoClient()
db = client.chess_game

movehistorycltn = db.move_history

def make_move_entry(game_id,prev_state,new_state,curr_player,next_player):
    move_object = {
        "game_id" : game_id,
        "prev_state" : prev_state,
        "curr_state" : new_state,
        "curr_player" : curr_player,
        "next_player" : next_player
    }
    move = movehistorycltn.insert_one(move_object)
    return move.inserted_id

def get_moves_by_game_id(game_id):
    return list(movehistorycltn.find({"game_id" : game_id}))