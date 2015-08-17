# -*- coding: utf-8 -*-
from bson.objectid import ObjectId
from config import AUTH, HOST
from pymongo import MongoClient
from werkzeug.exceptions import NotFound


client = MongoClient(HOST)
db = client.xdf

if AUTH:
    from config import USER, PWD
    db.authenticate(USER, PWD)


class Collection(object):

    def __init__(self, data=None):
        self.data = {} if data is None else data

    @classmethod
    def find(cls, *args, **kwargs):
        '''Wrap the collection.find method and return a dict list.'''
        return list(cls.collection.find(*args, **kwargs))

    @classmethod
    def get(cls, *args, **kwargs):
        result = cls.collection.find_one(*args, **kwargs)
        if result is None:
            raise NotFound()
        return cls(result)

    @classmethod
    def insert(cls, data, **kwargs):
        if '_id' not in data:
            data['_id'] = str(ObjectId())
        cls.collection.insert(data, **kwargs)
        return data['_id']

    @classmethod
    def remove(cls, *args, **kargs):
        '''Wrap the collection.remove method.'''
        cls.collection.remove(*args, **kargs)

    def update(self, spec, **kwargs):
        self.collection.update({'_id': self.data['_id']}, spec, **kwargs)


import answer
import assignment
import lesson
import question
import student
import user