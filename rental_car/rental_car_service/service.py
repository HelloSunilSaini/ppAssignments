from flask import Flask,request
from flask_restful import Resource, Api
from flask_cors import CORS

from serviceapis.ping import Ping
from serviceapis.user import User
from serviceapis.userValidation import UserValidation
from serviceapis.gameInstance import GameInstance 
from serviceapis.move import Move 


app = Flask(__name__)
CORS(app)
api = Api(app)

api.add_resource(Ping, '/gameservice/ping/')
api.add_resource(User, '/gameservice/user/','/gameservice/user/<string:user_id>/')
api.add_resource(UserValidation, '/gameservice/uservalidation/')
api.add_resource(GameInstance, '/gameservice/gameinstance/')
api.add_resource(Move,'/gameservice/move/')

 
if __name__ == '__main__':
    app.run(debug=True , port = 6756)
