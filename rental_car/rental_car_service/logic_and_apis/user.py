from flask_restful import Resource
from flask import request 
from jsonschema import validate
from os import getenv,environ

from database_access.user import get_user_by_id, get_all_user, get_user_by_mail, create_user,delete_user
from database_access.session import get_session

class User(Resource):

    def __init__(self):
        self.schema = {
            "type" : "object",
            "properties" : {
                "name" : {"type" : "string"},
                "email" : {
                    "type" : "string",
                    "pattern": "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"
                },
                "password" : {"type" : "string"},
                "address": {
                    "type": "object",
                    "properties": {
                        "address_line_1": { "type": "string"},
                        "address_line_2": { "type": "string"},
                        "landMark": {"type": "string"},
                        "city": { "type": "string"},
                        "state":  { "type": "string"},
                        "pincode":  { 
                            "type": "string",
                            "pattern" : "^[1-9][0-9]{5}$"
                        }
                    },
                    "required":["address_line_1","address_line_2","city","state","pincode","landMark"]
                },
                "contact_no" : {
                    "type" : "string",
                    "pattern": "^[1-9][0-9]{9}$"
                }
            },
            "required":["name","email","password","address","contact_no"]
        }

    def __validate_user(self,payload):
        try:
            validate(payload,self.schema)
            return True
        except:
            return False
    

    def __single(self,user_object):
        return {
            "userId" : str(user_object["_id"]),
            "email" : user_object.get("email","No Email Address"),
            "name" : user_object.get("name","Default Name"),
            "address" : user_object["address"],
            "contact_no" : user_object["contact_no"]
        }

    def __multiple(self,user_objects):
        return [ self.__single(user_object) for user_object in user_objects ]


    def get(self):
        params = request.args.to_dict()
        session = get_session(params['token'])
        current_user_id = str(session['user'])
        if current_user_id:
            user = get_user_by_id(current_user_id)
            if not user:
                return {
                    "response" : None,
                    "messege" : "Invalid Token",
                    "status": False
                }, 404  
            return {
                "response" : self.__single(user),
                "messege" : "Ok",
                "status": True
            },200
        else:
            master_email = params['master_email']
            master_password = params['master_password']

            actual_master_email = environ.get('master_email')
            actual_master_password = environ.get('master_password')
            
            if (actual_master_email != master_email):
                return {
                    "response" : None,
                    "messege" :"Master email incorrect",
                    "status" : False
                },400
            

            if(actual_master_password != master_password):
                return {
                    "response" : None,
                    "messege" :"Master passsword incorrect",
                    "status" : False
                },400
            
            users = get_all_user()
            return {
                "response" : self.__multiple(users),
                "messege" : "Ok",
                "status": True
            },200


    def post(self):
        params = request.args.to_dict()
        master_email = params['master_email']
        master_password = params['master_password']

        actual_master_email = environ.get('master_email')
        actual_master_password = environ.get('master_password')
        
        if (actual_master_email != master_email):
            return {
                "response" : None,
                "messege" :"Master email incorrect",
                "status" : False
            },400

        if(actual_master_password != master_password):
            return {
                "response" : None,
                "messege" :"Master passsword incorrect",
                "status" : False
            },400

        payload = request.json
        if not self.__validate_user(payload):
            return {
                "response" : None,
                "messege" : "Error Schema validation",
                "status": False
            }, 401    

        email = payload['email']
        user = get_user_by_mail(email)
        if user:
            return {
                "response" : None,
                "messege" : "User Already Exist with this Email",
                "status" : False
            }, 401

        create_user(payload)
        user = get_user_by_mail(email)
        return {
            "response" : None,
            "messege" : "User created Successfully",
            "status" : True
        }, 200


    def put(self):
        params = request.args.to_dict()
        master_email = params['master_email']
        master_password = params['master_password']

        actual_master_email = environ.get('master_email')
        actual_master_password = environ.get('master_password')
        
        if (actual_master_email != master_email):
            return {
                "response" : None,
                "messege" :"Master email incorrect",
                "status" : False
            },400

        if(actual_master_password != master_password):
            return {
                "response" : None,
                "messege" :"Master passsword incorrect",
                "status" : False
            },400

        user_id = params["userId"]
        delete_user(user_id)
        return {
            "response" : None,
            "messege" :"User Deleted successfully",
            "status" : True
        },200
