from flask_restful import Resource
from flask import request 
from jsonschema import validate

from database_access.user import get_user_by_id
from database_access.session import get_session
from database_access.customer import create_customer,get_customer_by_mail

class Customer(Resource):

    def __init__(self):
        self.schema = {
            "type" : "object",
            "properties" : {
                "name" : {"type" : "string"},
                "email" : {
                    "type" : "string",
                    "pattern": "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"
                },
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
            "required":["name","email","address","contact_no"]
        }

    def __validate_customer(self,payload):
        try:
            validate(payload,self.schema)
            return True
        except:
            return False
    

    def __single(self,customer_obj):
        return {
            "customerId" : str(customer_obj["_id"]),
            "email" : customer_obj.get("email","No Email Address"),
            "name" : customer_obj.get("name","Default Name"),
            "address" : customer_obj["address"],
            "contact_no" : customer_obj["contact_no"]
        }

    def __single_user(self,user_object):
        return {
            "userId" : str(user_object["_id"]),
            "email" : user_object.get("email","No Email Address"),
            "name" : user_object.get("name","Default Name"),
            "address" : user_object["address"],
            "contact_no" : user_object["contact_no"]
        }

    def __multiple(self,customer_objs):
        return [ self.__single(customer_obj) for customer_obj in customer_objs ]


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
        
        customer_email = params['customer_email']
        customer = get_customer_by_mail(customer_email)
        if customer:
            return {
                "response" : customer,
                "messege" : "ok",
                "status" : True
            },200
        return {
            "response" : None,
            "messege" : "customer not found by email",
            "status" : False
        },404

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
        if not self.__validate_customer(payload):
            return {
                "response" : None,
                "messege" : "Error Schema validation",
                "status": False
            }, 401    

        email = payload['email']
        customer = get_customer_by_mail(email)
        if customer:
            return {
                "response" : None,
                "messege" : "Customer Already Exist with this Email",
                "status" : False
            }, 401
        customer_obj = {
            "name" : payload["name"],
            "email" : payload["email"],
            "contact_no" : payload["contact_no"],
            "address" : payload["address"],
            "created_by" :self.__single_user(user)
        }
        create_customer(customer_obj)
        return {
            "response" : None,
            "messege" : "customer created Successfully",
            "status" : True
        }, 200
