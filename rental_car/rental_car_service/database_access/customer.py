from pymongo import MongoClient
from bson import ObjectId

client = MongoClient()
db = client.rental_car

customercltn = db.customers

def get_customer_by_id(customer_id):
    return customercltn.find_one({"_id" : ObjectId(user_id)})

def get_all_customers():
    return list(customercltn.find({}))

def get_customer_by_mail(email):
    return customercltn.find_one({"email" : email})

def create_customer(customer_object):
    customer = customercltn.insert_one(customer_object)
    return customer.inserted_id

