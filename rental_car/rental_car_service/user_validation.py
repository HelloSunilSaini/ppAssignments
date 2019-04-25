from flask_restful import Resource
from flask import request 
from dao.user import get_user_by_mail 
from dao.session import create_user_session ,expire_session
import uuid 


class UserValidation(Resource):

    def post(self):
        payload = request.json
        try:
            email = payload['email']
            password = payload['password']
        except:
            return {"response" : "Bad request","status": False} , 400

        user = get_user_by_mail(email)
        if not user:
            return {"response" : "User does not exist","status": False}, 404

        if not user["password"] == password:
            return {"response" : "Incorrect Password","status": False}, 401

        token = str(uuid.uuid4())
        create_user_session( user["_id"] , token )

        return {
            "response" : {"token" : token},
            "status" :  True  
        },200

    def put(self):
        params = request.args.to_dict()
        token = params["token"]
        expire_session(token)
        return {
            "response" : "session expired",
            "status" : True
        },200
