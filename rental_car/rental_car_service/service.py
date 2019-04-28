from flask import Flask,request
from flask_restful import Resource, Api
from flask_cors import CORS

from logic_and_apis.ping import Ping
from logic_and_apis.user import User
from logic_and_apis.userValidation import UserValidation
from logic_and_apis.insurance import Insurance
from logic_and_apis.customer import Customer
from logic_and_apis.car import Car
from logic_and_apis.car_rent_bill import CarBill


app = Flask(__name__)
CORS(app)
api = Api(app)

api.add_resource(Ping, '/rental_car/ping/')
api.add_resource(User, '/rental_car/user/','/rental_car/user/<string:user_id>/')
api.add_resource(UserValidation, '/rental_car/uservalidation/')
api.add_resource(Car, '/rental_car/car/')
api.add_resource(Customer, '/rental_car/customer/')
api.add_resource(Insurance, '/rental_car/insurance/')
api.add_resource(CarBill, '/rental_car/carBill/')


 
if __name__ == '__main__':
    app.run(debug=True , port = 6756)
