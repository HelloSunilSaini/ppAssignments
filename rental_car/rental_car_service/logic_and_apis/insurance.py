from flask_restful import Resource
from flask import request 
from jsonschema import validate

from database_access.user import get_user_by_id
from database_access.session import get_session
from database_access.insurance import create_insurance,get_all_insurance,get_insurance_by_id

class Insurance(Resource):

    def __init__(self):
        self.schema = {
            "type" : "object",
            "properties" : {
                "insurance_name" : {"type" : "string"},
                "price_percent_on_car_rent" : {"type" : "integer"},
                "description" : {"type" : "string"}
            },
            "required":["insurance_name","price_percent_on_car_rent"]
        }

    def __validate_insurance(self,payload):
        try:
            validate(payload,self.schema)
            return True
        except:
            return False
    

    def __single(self,insurance_object):
        return {
            "insuranceId" : str(insurance_object["_id"]),
            "insurance_name" : insurance_object.get("insurance_name","no insurance_name"),
            "price_percent_on_car_rent" : insurance_object["price_percent_on_car_rent"],
            "description" : insurance_object["description"],
            "added_by" : insurance_object["added_by"]  
        }
    
    def __single_user(self,user_object):
        return {
            "userId" : str(user_object["_id"]),
            "email" : user_object.get("email","No Email Address"),
            "name" : user_object.get("name","Default Name"),
            "address" : user_object["address"],
            "contact_no" : user_object["contact_no"]
        }

    def __multiple(self,insurance_objects):
        return [ self.__single(insurance_object) for insurance_object in insurance_objects ]


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
            insuranceId = params["insuranceId"]
            insurance = get_insurance_by_id(insuranceId)
            return {
                "response" : self.__single(insurance),
                "messege" : "ok",
                "status" : True
            },200
        else:
            insurances = get_all_insurance()
            return {
                "response" : self.__multiple(insurances),
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
        if not self.__validate_insurance(payload):
            return {
                "response" : None,
                "messege" : "Error Schema validation",
                "status": False
            }, 401    

        insurance_obj = {
            "insurance_name" : payload["insurance_name"],
            "price_percent_on_car_rent" :  payload["price_percent_on_car_rent"],
            "description" :  payload["description"],
            "added_by" : self.__single_user(user)
        }
        create_insurance(insurance_obj)
        return {
            "response" : None,
            "messege" : "insurance created Successfully",
            "status" : True
        }, 200
