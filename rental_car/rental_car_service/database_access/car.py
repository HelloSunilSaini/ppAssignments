from pymongo import MongoClient
from bson import ObjectId

client = MongoClient()
db = client.rental_car

carcltn = db.cars


AVAILABLE_STATUS = "AVAILABLE"
RENT_STATUS = "ON_RENT"

def get_car_by_id(customer_id):
    return carcltn.find_one({"_id" : ObjectId(user_id)})

def get_all_cars():
    return list(carcltn.find({}))

def create_car(car_object):
    car = carcltn.insert_one(car_object)
    return car.inserted_id

def get_car_by_status(status):
    return list(carcltn.find({"status" : status}))

def update_car_status(carId,status):
    carcltn.update_one({"_id" : ObjectId(carId)}, {"$set" : {"status" : status}})
