# -*- coding: utf-8 -*-
from base64 import b64encode
from datetime import datetime
from model import Collection, db
from uuid import uuid4


class UserToken(Collection):
    '''
* `_id` (string) - Token
* `updateTime` (datetime) - Token will be expired 1 month after last update
* `userId` (string)
    '''

    collection = db.user.token

    class Field(object):
        _id = '_id'
        updateTime = 'updateTime'
        userId = 'userId'

    collection.ensure_index(Field.updateTime, expireAfterSeconds=2592000)

    @staticmethod
    def generate_token(cls, user_id):
        '''Generate a new token for specific user.'''
        return UserToken.insert({
            '_id': filter(lambda x: x not in ['+', '=', '/'],
                          b64encode(uuid4().bytes)),
            cls.Field.updateTime: datetime.utcnow(),
            cls.Field.userId: user_id
        })

    @staticmethod
    def update_token(user_id, token):
        try:
            UserToken.get({
                UserToken.Field._id: token
            })
        except:
            UserToken.insert({UserToken.Field._id: token,
                              UserToken.Field.userId: user_id,
                              UserToken.Field.updateTime: datetime.now()})
