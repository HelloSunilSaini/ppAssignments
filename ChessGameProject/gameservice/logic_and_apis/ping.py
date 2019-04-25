from flask_restful import Resource

class Ping(Resource):
    def get(self):
        return {
            "response" : None,
            "messege" : "All OK",
            "status":True
        },200