from pymongo import MongoClient
from bson import ObjectId

client = MongoClient()
db = client.chess_game

usercltn = db.users

def get_user_by_id(user_id):
    return usercltn.find_one({"_id" : ObjectId(user_id)})

def get_all_user():
    return list(usercltn.find({}))

def get_user_by_mail(email):
    return usercltn.find_one({"email" : email})

def create_user(user_object):
    user = usercltn.insert_one(user_object)
    return user.inserted_id

