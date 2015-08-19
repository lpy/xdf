# -*- coding: utf-8 -*-
from datetime import datetime
from model import Collection, db


class Assignment(Collection):
    '''
* `_id` (string)
* `name` (string) - 作业名称
* `questionList` (list of string) - 作业的问题列表
    '''

    collection = db.assignment

    class Field(object):
        _id = '_id'
        name = 'name'
        questionList = 'questionList'
        createTime = 'createTime'

    class Analysis(object):
        totalScore = 'total'
        totalAnswer = 'totalAnswer'


    @staticmethod
    def new_assignment(name):
        return Assignment.insert({
            Assignment.Field.name: name,
            Assignment.Field.questionList: [],
            Assignment.Field.createTime: datetime.now()
        })
