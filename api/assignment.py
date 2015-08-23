# -*- coding: utf-8 -*-
from __future__ import division
from api import api
from config import RELEASE_LINK, SHORT_URL_HOST
from flask import jsonify, request
from model.answer import Answer
from model.assignment import Assignment
from model.lesson import Lesson
from model.question import Question
from model.student import Student
from model.url import URL
from util.assignment import check_answer, fetch_assignment
from util.xlsx import generate_xlsx
import json


@api.route('/v1/assignments', methods=['GET'])
def fetch_all_assignments():
    assignment_lists = Assignment.find({}, [
        Assignment.Field._id
    ], sort=[(Assignment.Field.createTime, 1)])
    assignments = []
    for assignment in assignment_lists:
        assignments.append(fetch_assignment(assignment[Assignment.Field._id]))
    return jsonify(stat=0, assignments=assignments)


@api.route('/v1/assignment', methods=['POST'])
def new_assignment():
    '''
## 创建新作业

    '''
    name = request.get_json().get('name', '')
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
    student_id = request.args.get('studentId', '')
    if not student_id:
        return jsonify(stat=1, )
    assignment = fetch_assignment(assignment_id)
    return jsonify(stat=0, assignment=assignment, studentId=student_id)


@api.route('/v1/assignment/<assignment_id>', methods=['DELETE'])
def delete_assignment(assignment_id):
    assignment = Assignment.get({
        Assignment.Field._id: assignment_id
    }, [
        Assignment.Field.questionList
    ])
    for question_id in assignment.data.get(Assignment.Field.questionList):
        Question.remove({
            Question.Field._id: question_id
        })
    Assignment.remove({
        Assignment.Field._id: assignment_id
    })
    return jsonify(stat=0,)


@api.route('/v1/assignment/release', methods=['POST'])
def release_assignment():
    pass


@api.route('/v1/assignment/<assignment_id>/answer', methods=['POST'])
def answer_assignment(assignment_id):
    '''
## 回答作业

    POST /api/v1/assignment/<assignment_id>/answer?studentId=

Parameters:

* `studentId` (string, required) - 作答的学生ID
* `answerList` (string, required) - JSON 序列化后的列表，每一项均为整数，不作答为 -1

Return:

* `score` (double) - 所答分数
* `answerId` (string) - 本次作答的答案ID
    '''
    student_id = request.args.get('studentId', None)
    answer_list = json.loads(request.form.get('answerList'))
    if student_id is None:
        return jsonify(stat=1, ), 401
    student = Student.get({
        Student.Field._id: student_id
    }, [
        Student.Field.assignmentList
    ])

    # 删除旧答案
    if assignment_id in student.data.get(Student.Field.assignmentList):
        old_answer = Answer.get({
            Answer.Field.assignmentId: assignment_id,
            Answer.Field.studentId: student_id
        })
        Answer.remove({
            Answer.Field.assignmentId: assignment_id,
            Answer.Field.studentId: student_id
        })
        Student.collection.update({
            Student.Field._id: student_id
        }, {
            '$pull': {
                Student.Field.assignmentList: assignment_id,
                Student.Field.answerList: old_answer.data.get(Answer.Field._id)
            }
        })

    score = check_answer(assignment_id, answer_list)
    answer_id = Answer.new_answer(assignment_id, student_id, answer_list, score)
    Student.collection.update({
        Student.Field._id: student_id,
    }, {
        '$push': {
            Student.Field.answerList: answer_id,
            Student.Field.assignmentList: assignment_id
        }
    })

    # 统计作业被回答次数
    Assignment.collection.update({
        Assignment.Field._id: assignment_id
    }, {
        '$inc': {
            Assignment.Field.totalCompletion: 1
        }
    })
    return jsonify(stat=0, score=score, answerId=answer_id)


@api.route('/v1/assignment/<assignment_id>/release', methods=['POST'])
def release_assignment_to_lesson(assignment_id):
    '''
    '''
    json_data = request.get_json()
    lesson_id = json_data.get('lessonId')
    lesson = Lesson.get({
        Lesson.Field._id: lesson_id
    }, [
        Lesson.Field.studentList,
        Lesson.Field.name
    ])
    assignment = Assignment.get({
        Assignment.Field._id: assignment_id
    }, [
        Assignment.Field.name
    ])
    release_links = []
    student_ids = []
    student_names = []
    for student_id in lesson.data.get(Lesson.Field.studentList):
        link = '%s?s=%s&a=%s' % (RELEASE_LINK, student_id, assignment_id)
        link = SHORT_URL_HOST + URL.generate_short_url(link, assignment_id, student_id)
        release_links.append(link)
        student = Student.get({
            Student.Field._id: student_id
        }, [
            Student.Field.studentId,
            Student.Field.name
        ])
        student_names.append(student.data.get(Student.Field.name))
        student_ids.append(student.data.get(Student.Field.studentId))
    excel_name = generate_xlsx(student_ids, student_names, release_links,
                               lesson.data.get(Lesson.Field.name), assignment.data.get(Assignment.Field.name))
    return jsonify(stat=0, links=release_links, studentIds=student_ids, studentNames=student_names, excel=excel_name)


@api.route('/v1/assignment/<assignment_id>/analysis', methods=['GET'])
def fetch_assignment_analysis(assignment_id):
    assignment = Assignment.get({
        Assignment.Field._id: assignment_id
    })
    stu_answer_list = Answer.find({
        Answer.Field.assignmentId: assignment_id
    })
    correct_answer_list = []
    answer_sum = []
    answer_correct_sum = []
    audio_click = []
    all_score = 0.0
    for question_id in assignment.data.get(Assignment.Field.questionList):
        question = Question.get({
            Question.Field._id: question_id
        }, [
            Question.Field.answer,
            Question.Field.audioClick
        ])
        correct_answer_list.append(question.data.get(Question.Field.answer))
        answer_sum.append(0)
        answer_correct_sum.append(0)
        audio_click.append(question.data.get(Question.Field.audioClick))

    length = len(correct_answer_list)
    for stu_answer in stu_answer_list:
        stu_answers = stu_answer.get(Answer.Field.answerList)
        for i in xrange(0, length):
            if stu_answers[i] == -1:
                continue
            answer_sum[i] += 1
            if stu_answers[i] == correct_answer_list[i]:
                answer_correct_sum[i] += 1
        all_score += stu_answer.get(Answer.Field.score)

    accuracy = []
    for i in xrange(0, length):
        if answer_correct_sum[i] != 0:
            accuracy.append(answer_correct_sum[i] / answer_sum[i])
        else:
            accuracy.append(0.0)
    average = all_score / len(stu_answer_list)

    return jsonify(stat=0, average=average, accuracy=accuracy,
                   audioClick=audio_click,
                   totalCompletion=assignment.data.get(Assignment.Field.totalCompletion))
