from flask import Flask,request
from flask_restful import Resource, Api
from flask_cors import CORS

from logic_and_apis.ping import Ping
from logic_and_apis.user import User
from logic_and_apis.userValidation import UserValidation
from logic_and_apis.gameInstance import GameInstance 
from logic_and_apis.move import Move 


app = Flask(__name__)
CORS(app)
api = Api(app)

api.add_resource(Ping, '/tictactoe/ping/')
api.add_resource(User, '/tictactoe/user/','/tictactoe/user/<string:user_id>/')
api.add_resource(UserValidation, '/tictactoe/uservalidation/')
api.add_resource(GameInstance, '/tictactoe/gameinstance/')
api.add_resource(Move,'/tictactoe/move/')

 
if __name__ == '__main__':
    app.run(debug=True , port = 6756)
