from flask_restful import Resource
from flask import request 
import uuid 

from database_access.user import get_user_by_mail 
from database_access.session import create_user_session ,expire_session


class UserValidation(Resource):

    def post(self):
        payload = request.json
        try:
            email = payload['email']
            password = payload['password']
        except:
            return {
                "response" : None, 
                "messege" : "Bad request",
                "status": False
            },400

        user = get_user_by_mail(email)
        if not user:
            return {
                "response" : None,
                "messege" : "User does not exist",
                "status": False
            }, 404

        if not user["password"] == password:
            return {
                "response" : None,
                "messege" : "Incorrect Password",
                "status": False
            }, 401

        token = str(uuid.uuid4())
        create_user_session( user["_id"] , token )

        return {
            "response" : {"token" : token},
            "messege" : "Login Successfully",
            "status" :  True  
        },200

    def put(self):
        params = request.args.to_dict()
        token = params["token"]
        expire_session(token)
        return {
            "response" : None,
            "messege" : "session expired",
            "status" : True
        },200