# -*- coding: utf-8 -*-
from api import api
from flask import jsonify, request
from model.question import Question
import json


@api.route('/v1/question', methods=['POST'])
def new_question():
    assignment_id = request.form.get('assignmentId', None)
    content = request.form.get('content', '')
    option_list = json.loads(request.form.get('optionList'))
    answer = request.form.get('answer', type=int)
    answer_content = request.form.get('answerContent', '')
    audio = request.form.get('audio', '')
    question_id = Question.new_question(assignment_id, content, option_list,
                                        answer, answer_content, audio)
    return jsonify(stat=0, questionId=question_id)


@api.route('/v1/question/<question_id>', methods=['DELETE'])
def delete_question(question_id):
    Question.remove({
        Question.Field._id:question_id
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
