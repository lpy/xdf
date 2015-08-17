# -*- coding: utf-8 -*-
from model import Collection, db


class Answer(Collection):
    '''
* `_id` (string)
* `answerList` (list of int) - 答案列表
* `assignmentId` (string) - 该答案所属的作业 ID
* `score` (double) - 分数
* `studentId` (string) - 答案所属的学生 ID
    '''

    collection = db.answer

    class Field(object):
        _id = '_id'
        answerList = 'answerList'
        assignmentId = 'assignmentId'
        score = 'score'
        studentId = 'studentId'

    @staticmethod
    def new_answer(assignment_id, student_id, answer_list, score):
        return Answer.insert({
            Answer.Field.answerList: answer_list,
            Answer.Field.assignmentId: assignment_id,
            Answer.Field.studentId: student_id,
            Answer.Field.score: score
        })
