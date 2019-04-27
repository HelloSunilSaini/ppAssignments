from pymongo import MongoClient
from bson import ObjectId

client = MongoClient()
db = client.rental_car

insurancecltn = db.insurance

def get_insurance_by_id(customer_id):
    return insurancecltn.find_one({"_id" : ObjectId(user_id)})

def get_all_insurance():
    return list(insurancecltn.find({}))

def create_insurance(insurance_obj):
    insurance = insurancecltn.insert_one(insurance_obj)
    return insurance.inserted_id

