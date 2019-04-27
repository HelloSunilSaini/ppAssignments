from flask_restful import Resource
from flask import request 
from jsonschema import validate

from database_access.user import get_user_by_id
from database_access.session import get_session
from database_access.car import (
    create_car,
    get_car_by_id,
    get_all_cars,
    get_car_by_status,
    AVAILABLE_STATUS,
)

class Car(Resource):

    def __init__(self):
        self.schema = {
            "type" : "object",
            "properties" : {
                "car_name" : {"type" : "string"},
                "model" : {"type" : "string"},
                "car_no" : {"type" : "string"},
                "color" : {"type" : "string"},
                "ac_status" : {"type" : "boolean"},
                "sitting_capacity" : {"type" : "integer"},
                "mileage" : {"type" : "integer"},
                "rent_per_day" : {"type" : "integer"}
            },
            "required":["car_name","car_no","model","sitting_capacity","mileage","rent_per_day"]
        }

    def __validate_car(self,payload):
        try:
            validate(payload,self.schema)
            return True
        except:
            return False
    

    def __single(self,car_obj):
        return {
            "carId" : str(car_obj["_id"]),
            "car_name" : car_obj.get("car_name","no car_name"),
            "model" : car_obj.get("model","Default model"),
            "car_no" : car_obj["car_no"],
            "color" : car_obj["color"],
            "ac_status" : car_obj["ac_status"],
            "sitting_capacity" : car_obj["sitting_capacity"],
            "mileage" : car_obj["mileage"],
            "rent_per_day" : car_obj["rent_per_day"],   
            "status" : car_obj["status"],
            "added_by" : car_obj["added_by"]
        }
    
    def __single_user(self,user_object):
        return {
            "userId" : str(user_object["_id"]),
            "email" : user_object.get("email","No Email Address"),
            "name" : user_object.get("name","Default Name"),
            "address" : user_object["address"],
            "contact_no" : user_object["contact_no"]
        }

    def __multiple(self,car_objs):
        return [ self.__single(car_obj) for car_obj in car_objs ]


    def get(self):
        params = request.args.to_dict()
        session = get_session(params['token'])
        if not session :
            return {
                    "response" : None,
                    "messege" : "Invalid Token",
                    "status": False
                }, 404 

        current_user_id = str(session['user'])
        user = get_user_by_id(current_user_id)
        if not user:
            return {
                "response" : None,
                "messege" : "Invalid Token",
                "status": False
            }, 404  
        
        reqType = params['type']
        if reqType == "ID":
            carId = params["carId"]
            car = get_car_by_id(carId)
            return {
                "response" : self.__single(car),
                "messege" : "ok",
                "status" : True
            },200
        elif reqType == "STATUS":
            status = params["status"]
            cars = get_car_by_status(status)
            return {
                "response" : self.__multiple(cars),
                "messege" : "ok",
                "status" : True
            },200
        else:
            cars = get_all_cars()
            return {
                "response" : self.__multiple(cars),
                "messege" : "ok",
                "status" : True
            },200

    def post(self):
        params = request.args.to_dict()
        session = get_session(params['token'])
        if not session :
            return {
                    "response" : None,
                    "messege" : "Invalid Token",
                    "status": False
                }, 404 

        current_user_id = str(session['user'])
        user = get_user_by_id(current_user_id)
        if not user:
            return {
                "response" : None,
                "messege" : "Invalid Token",
                "status": False
            }, 404  

        payload = request.json
        if not self.__validate_car(payload):
            return {
                "response" : None,
                "messege" : "Error Schema validation",
                "status": False
            }, 401    

        car_obj = {
            "car_name" : payload["car_name"],
            "model" :  payload["model"],
            "color" :  payload["color"],
            "car_no" : payload["car_no"],
            "ac_status" : payload["ac_status"],
            "sitting_capacity" :payload["sitting_capacity"],
            "mileage" :  payload["mileage"],
            "rent_per_day": payload["rent_per_day"],
            "status" : AVAILABLE_STATUS,
            "added_by" : self.__single_user(user)
        }
        create_car(car_obj)
        return {
            "response" : None,
            "messege" : "car created Successfully",
            "status" : True
        }, 200
