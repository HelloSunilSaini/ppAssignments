from flask_restful import Resource
from flask import request

from pymongo import MongoClient
from bson import ObjectId
from jsonschema import validate


class Car(Resource):
    def __init__(self):
        client = MongoClient()
        db = client.car_rental
        self.carcltn = db.cars
        self.schema = {
            "type" : "object",
            "properties" : {
                "model" : {"type" : "string"},
                "car_no" : {"type" : "string"},
                "rent_per_day":{"type" : "string"}
            }
        }

    def __get_by_id_from_db(self,car_id):
        return self.carcltn.find_one({"_id" : ObjectId(car_id)})

    def __get_all_from_db(self):
        return list(self.carcltn.find({}))

    def __insert_car_to_db(self,user_object):
        self.carcltn.insert_one(user_object)

    def __JSON(self,user_object):
        return {
            "userId" : str(user_object["_id"]),
            "eMailAddress" : user_object.get("email","No Email Address"),
            "userName" : user_object.get("name","Default Name"),
        }
        
    def __JSON_multiple(self,user_obj_list):
        return [self.__JSON(user_obj) for user_obj in user_obj_list]

    def __validate(self,payload):
        try:
            validate(payload,self.schema)
            return True
        except:
            return False

    def get(self):
        params = request.args.to_dict()
        session = get_session(params['token'])
        user_id = session['user']
        if current_user_id:
            user = self.__get_by_id(user_id)
            if not user:
                return {"response" : "Invalid Token","status": False}, 400 
            return {"response" : self.__JSON(user),"status": True },200

    def post(self):
        payload = request.json
        if not self.__validate(payload):
            return {"response" : "Invalid Email or Password ",
            "status": False}, 401    

        email = payload['email']
        user = self.__get_by_mail(email)
        if user:
            return {"response" : "User Already Exist with this Email","status" : False}, 401

        self.__create(payload)
        user = self.__get_by_mail(email)
        return {"response" : "User created Successfully","status" : True}, 200
