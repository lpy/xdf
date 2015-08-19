# -*- coding: utf-8 -*-
from datetime import datetime
from flask.ext.login import make_secure_token, UserMixin
from model import Collection, db
from model.user_token import UserToken
from uuid import uuid4
import hashlib


class User(Collection, UserMixin):
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
        createTime = 'createTIme'

    def get_id(self):
        """
        Override UserMixin get_id methods, because there is no
        `id` field in User object
        """
        return unicode(self.data[User.Field._id])

    def get_auth_token(self):
        token = unicode(make_secure_token(self.data[User.Field._id],
                                          self.data[User.Field.password],
                                          uuid4().hex))
        UserToken.update_token(self.data[User.Field._id], token)
        return token

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
            User.Field.password: hash_password,
            User.Field.createTime: datetime.now()
        })
