# -*- coding: utf-8 -*-
from bson import ObjectId
from model import Collection, db
from time import time
import hashlib


class User(Collection):
    '''
#### Dashboard 用户
* `_id` (ObjectId) - 用户 ID
* `name` (string)
* `password` (string)
    '''

    collection = db.user

    class Field:
        _id = '_id'
        name = 'name'
        password = 'password'

    @staticmethod
    def get_hashed_password(password):
        md5 = hashlib.md5()
        md5.update(password)
        hash_password = md5.hexdigest()
        return hash_password

    @staticmethod
    def new_admin(name, password):
        hash_password = User.get_hashed_password(password)
        return User.insert({
            User.Field.name: name,
            User.Field.password: hash_password
        })
