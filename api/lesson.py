# -*- coding: utf-8 -*-
from api import api
from flask import jsonify, request
from model.lesson import Lesson
from util.lesson import fetch_lesson
from util.student import delete_student


@api.route('/v1/lessons', methods=['GET'])
def fetch_all_lesson():
    lesson_ids = Lesson.find({}, [
        Lesson.Field._id
    ], sort=[(Lesson.Field.createTime, 1)])
    lessons = []
    for lesson in lesson_ids:
        lessons.append(fetch_lesson(lesson[Lesson.Field._id]))
    return jsonify(stat=0, lessons=lessons)


@api.route('/v1/lesson', methods=['POST'])
def new_lesson():
    '''
### 创建新班级

    '''
    name = request.get_json(force=True).get('name')
    lesson_id = Lesson.new_lesson(name)
    lesson = fetch_lesson(lesson_id)

    return jsonify(stat=0, lesson=lesson)


@api.route('/v1/lesson/<lesson_id>', methods=['GET'])
def get_lesson(lesson_id):
    '''
### 获取班级

    GET /api/v1/lesson/<lesson_id>

Return:

* `lesson` (list of dict)
    * `name` (string) - 作业名
    * `studentList` (int) - 学生列表
    * `questionList` (list of dict) - 问题列表
        * `answer` (int) - 正确答案编号
        * `answerContent` (string) - 答案解析
        * `assignmentId` (string) - 问题所属作业ID
        * `audio` (string) - 音频解析链接
        * `content` (string) - 问题内容
        * `optionList` (list of string) - 答案选项列表
    '''
    lesson = fetch_lesson(lesson_id)
    return jsonify(stat=0, lesson=lesson)


@api.route('/v1/lesson/<lesson_id>', methods=['DELETE'])
def delete_lesson(lesson_id):
    lesson = Lesson.get({
        Lesson.Field._id: lesson_id
    }, [
        Lesson.Field.studentList
    ]).data
    for student_id in lesson.get(Lesson.Field.studentList):
        delete_student(student_id)
    Lesson.remove({
        Lesson.Field._id: lesson_id
    })
    return jsonify(stat=0,)
