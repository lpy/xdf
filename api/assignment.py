# -*- coding: utf-8 -*-
from api import api
from flask import jsonify, request
from model.answer import Answer
from model.assignment import Assignment
from model.student import Student
from util.assignment import check_answer, fetch_assignment
import json


@api.route('/v1/assignment', methods=['POST'])
def new_assignment():
    '''
## 创建新作业

    '''
    name = request.form.get('name', '')
    assignment_id = Assignment.new_assignment(name)

    return jsonify(stat=0, assignmentId=assignment_id)


@api.route('/v1/assignment/<assignment_id>', methods=['GET'])
def get_assignment(assignment_id):
    '''
## 获取作业

    GET /api/v1/assignment/<assignment_id>

Return:

* `assignment` (list of dict)
    * `name` (string) - 作业名
    * `questionNum` (int) - 问题总数
    * `questionList` (list of dict) - 问题列表
        * `answer` (int) - 正确答案编号
        * `answerContent` (string) - 答案解析
        * `assignmentId` (string) - 问题所属作业ID
        * `audio` (string) - 音频解析链接
        * `content` (string) - 问题内容
        * `optionList` (list of string) - 答案选项列表
    '''
    assignment = fetch_assignment(assignment_id)
    return jsonify(stat=0, assignment=assignment)


@api.route('/v1/assignment/<assignment_id>/answer', methods=['POST'])
def answer_assignment(assignment_id):
    '''
## 回答作业

    POST /api/v1/assignment/<assignment_id>/answer?studentId=

Parameters:

* `studentId` (string, required) - 作答的学生ID
* `answerList` (string, required) - JSON 序列化后的列表，每一项均为整数

Return:

* `score` (double) - 所答分数
* `answerId` (string) - 本次作答的答案ID
    '''
    student_id = request.args.get('studentId', None)
    answer_list = json.loads(request.form.get('answerList'))
    if student_id is None:
        return jsonify(stat=1, ), 401
    student = Student.get({
        Student.Field.studentId: student_id
    }, [
        Student.Field.answerList
    ])
    if assignment_id in student.data.get(Student.Field.assignmentList):
        return jsonify(stat=1, ), 403
    score = check_answer(assignment_id, answer_list)
    answer_id = Answer.new_answer(assignment_id, student_id, answer_list, score)
    Student.collection.update({
        Student.Field.studentId: student_id,
    }, {
        '$push': {
            Student.Field.answerList: answer_id,
            Student.Field.assignmentList: assignment_id
        }
    })
    return jsonify(stat=0, score=score, answerId=answer_id)


@api.route('/v1/assignment/<assignment_id>', methods=['DELETE'])
def delete_assignment(assignment_id):
    pass