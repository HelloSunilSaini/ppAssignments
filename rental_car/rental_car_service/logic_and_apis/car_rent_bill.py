from flask_restful import Resource
from flask import request 
from jsonschema import validate

from database_access.user import get_user_by_id
from database_access.session import get_session
from database_access.car import get_car_by_id,update_car_status,AVAILABLE_STATUS,ON_RENT_STATUS
from database_access.insurance import get_insurance_by_id
from database_access.customer import get_customer_by_id
from database_access.car_rent_bill import *

class CarBill(Resource):

    def __init__(self):
        self.schema = {
            "type" : "object",
            "properties" : {
                "carId" : {"type" : "string"},
                "InsuranceId" : {"type" : "string"},
                "customerId" : {"type" : "string"},
                "forDays" : {"type" : "integer"}
            },
            "required":["carId","customerId","forDays"]
        }

    def __validate_carbill(self,payload):
        try:
            validate(payload,self.schema)
            return True
        except:
            return False
    

    def __single_car(self,car_obj):
        return {
            "carId" : str(car_obj["_id"]),
            "car_name" : car_obj.get("car_name","no car_name"),
            "model" : car_obj.get("model","Default model"),
            "car_no" : car_obj["car_no"],
            "color" : car_obj["color"],
            "ac_status" : car_obj["ac_status"],
            "sitting_capacity" : car_obj["sitting_capacity"],
            "mileage" : car_obj["mileage"],
            "rent_per_day" : car_obj["rent_per_day"]          
        }
    
    def __single_user(self,user_object):
        return {
            "userId" : str(user_object["_id"]),
            "email" : user_object.get("email","No Email Address"),
            "name" : user_object.get("name","Default Name"),
            "address" : user_object["address"],
            "contact_no" : user_object["contact_no"]
        }

    def __single_customer(self,cutomer_obj):
        return {
            "customerId" : str(cutomer_obj["_id"]),
            "email" : cutomer_obj.get("email","No Email Address"),
            "name" : cutomer_obj.get("name","Default Name"),
            "address" : cutomer_obj["address"],
            "contact_no" : cutomer_obj["contact_no"]
        }

     def __single_insurance(self,insurance_object):
        return {
            "insuranceId" : str(insurance_object["_id"]),
            "insurance_name" : insurance_object.get("insurance_name","no insurance_name"),
            "price_percent_on_car_rent" : insurance_object["price_percent_on_car_rent"],
            "description" : insurance_object["description"],
            "added_by" : insurance_object["added_by"]  
        }

    def __single(self,car_bill_obj):
        return {
            "rentBillId" :str(car_bill_obj["_id"]),
            "Insurance" : car_bill_obj["Insurance"],
            "customer" : car_bill_obj["customer"],
            "user" : car_bill_obj["user"],
            "status" : car_bill_obj["status"],
            "forDays" : car_bill_obj["forDays"],
            "grandTotal" : car_bill_obj["grandTotal"]
        }

    def __multiple(self,car_bill_objs):
        return [ self.__single(car_bill_obj) for car_bill_obj in car_bill_objs ]


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
            rentBillId = params["rentBillId"]
            rentBill = get_rent_bill_by_id(rentBillId)
            return {
                "response" : self.__single(rentBill),
                "messege" : "ok",
                "status" : True
            },200
        elif reqType == "STATUS":
            status = params["status"]
            rentBills = get_rent_bill_by_status(status)
            return {
                "response" : self.__multiple(rentBills),
                "messege" : "ok",
                "status" : True
            },200
        else:
            rentBills = get_all_rent_bills()
            return {
                "response" : self.__multiple(rentBills),
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
        if not self.__validate_carbill(payload):
            return {
                "response" : None,
                "messege" : "Error Schema validation",
                "status": False
            }, 401 


        forDays = payload["forDays"]

        car = self.__single_car(get_car_by_id(payload["carId"]))

        customer = self.__single_customer(get_customer_by_id(payload["customerId"]))

        insuranceId = payload["InsuranceId"]
        insurance = get_insurance_by_id(insuranceId)
        if insurance :
            insurance = self.__single_insurance(insurance)
            grandTotal = (
                (int(car["rent_per_day"]) * int(forDays)) + 
                (
                    (int(car["rent_per_day"]) * int(forDays) * 
                    int(insurance["price_percent_on_car_rent"])) / 100
                )
            )
        else:
            grandTotal = (int(car["rent_per_day"]) * int(forDays))

        

        car_bill_obj = {
            "customer" : customer,
            "user" : self.__single_user(user),
            "car" : car,
            "insurance" : insurance,
            "status" : RENT_STATUS,
            "forDays" : payload["fordays"]
            "grandTotal" : grandTotal
        }

        update_car_status(car["carId"],ON_RENT_STATUS)
        create_rent_bill(car_bill_obj)
        return {
            "response" : None,
            "messege" : "car rented Successfully",
            "status" : True
        }, 200

    def put(self):
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
        try:
            rentBillId = payload["rentBillId"]
        except:
            return{
                "response" : None,
                "messege" : "give rent bill Id",
                "status" : False
            },400
        rent_bill = get_rent_bill_by_id(rentBillId)
        update_car_status(rent_bill["car"]["carId"],AVAILABLE_STATUS)
        update_car_bill_status(rentBillId,RETURNED_STATUS)
        return {
            "response" : None,
            "messege" : "Car Returned successfully",
            "status" : True
        },200
