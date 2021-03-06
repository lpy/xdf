# -*- coding: utf-8 -*-
from datetime import datetime
from model import Collection, db

class Lesson(Collection):
    '''
* `_id` (string)
* `name` (string) - 课程名称
* `studentList` (list of string) - 课程下学生ID列表
    '''

    collection = db.lesson

    class Field(object):
        _id = '_id'
        name = 'name'
        studentList = 'studentList'
        createTime = 'createTime'

    @staticmethod
    def new_lesson(name):
        return Lesson.insert({
            Lesson.Field.name: name,
            Lesson.Field.studentList: [],
            Lesson.Field.createTime: datetime.now()
        })
