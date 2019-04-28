from pymongo import MongoClient
from bson import ObjectId

client = MongoClient()
db = client.rental_car

rentbillcltn = db.car_rent_bill

ON_RENT_STATUS = "ON_RENT"
RETURNED_STATUS = "RETURNED"

def get_rent_bill_by_id(rentbill_id):
    return rentbillcltn.find_one({"_id" : ObjectId(rentbill_id)})

def get_all_rent_bills():
    return list(rentbillcltn.find({}))

def create_rent_bill(rent_bill_object):
    rent_bill = rentbillcltn.insert_one(rent_bill_object)
    return rent_bill.inserted_id

def get_rent_bill_by_status(status):
    return list(rentbillcltn.find({"status" : status}))

def get_bill_by_customer_email(customer_email):
    return list(rentbillcltn.find({"customer.email" : customer_email}))

def get_bill_by_user_email(user_email):
    return list(rentbillcltn.find({"user.email" : user_email}))


def update_car_bill_status(billId,status):
    rentbillcltn.update_one({"_id" : ObjectId(billId)}, {"$set" : {"status" : status}})
