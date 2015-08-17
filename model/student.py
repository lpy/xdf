# -*- coding: utf-8 -*-
from model import Collection, db


class Student(Collection):
    '''
* `_id` (ObjectId) - 用户 ID
* `answerList` (list of string) - 回答的答案 ID
* `assignmentList` (list of string) - 完成的作业 ID
* `name` (string) - 学生姓名，可为空
* `studentId` (string) - 学生的唯一标识
    '''

    collection = db.student

    class Field:
        _id = '_id'
        answerList = 'answerList'
        assignmentList = 'assignmentList'
        name = 'name'
        studentId = 'studentId'

    collection.ensure_index(Field.studentId, sparse=True, unique=True)

    @staticmethod
    def new_student(name, student_id):
        return Student.insert({
            Student.Field.answerList: [],
            Student.Field.assignmentList: [],
            Student.Field.name: name,
            Student.Field.studentId: student_id
        })
