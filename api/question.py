# -*- coding: utf-8 -*-
from api import api
from flask import jsonify, request
from model.assignment import Assignment
from model.question import Question
import json


@api.route('/v1/question', methods=['POST'])
def new_question():
    form_data = request.get_json()
    print(form_data)
    assignment_id = form_data.get('assignmentId', None)
    content = form_data.get('content', '')
    option_list = json.loads(form_data.get('optionList'))
    answer = int(form_data.get('answer'))
    answer_content = form_data.get('answerContent', '')
    audio = form_data.get('audio', '')
    question_id = Question.new_question(assignment_id, content, option_list,
                                        answer, answer_content, audio)
    Assignment.collection.update({
        Assignment.Field._id: assignment_id,
    }, {
        '$push': {
            Assignment.Field.questionList: question_id
        }
    })
    return jsonify(stat=0, questionId=question_id)


@api.route('/v1/question/<question_id>', methods=['DELETE'])
def delete_question(question_id):
    question = Question.get({
        Question.Field._id: question_id
    }, [
        Question.Field.assignmentId
    ]).data
    Assignment.collection.update({
        Assignment.Field._id: question.get(Question.Field.assignmentId)
    }, {
        '$pull': {
            Assignment.Field.questionList: question_id
        }
    })
    Question.remove({
        Question.Field._id: question_id
    })
    return jsonify(stat=0,)


@api.route('/v1/question/<question_id>', methods=['PUT'])
def update_question(question_id):
    update_info = {}
    content = request.form.get('content', None)
    if content is not None:
        update_info[Question.Field.content] = content
    option_list = json.loads(request.form.get('optionList', '[]'))
    if option_list:
        update_info[Question.Field.optionList] = option_list
    answer = request.form.get('answer', None)
    if answer is not None:
        update_info[Question.Field.answer] = answer
    answer_content = request.form.get('answer', None)
    if answer_content is not None:
        update_info[Question.Field.answerContent] = answer_content
    audio = request.form.get('audio', None)
    if audio is not None:
        update_info[Question.Field.audio] = audio

    Question.collection.update({
        Question.Field._id: question_id
    }, {
        '$set': update_info
    })
    return jsonify(stat=0,)


@api.route('/v1/question/<question_id>/audio', methods=['PUT'])
def click_question_audio(question_id):
    Question.collection.update({
        Question.Field._id: question_id
    }, {
        '$inc': {
            Question.Field.audioClick: 1
        }
    })
    return jsonify(stat=0)
