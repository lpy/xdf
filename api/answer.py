# -*- coding: utf-8 -*-
from api import api
from flask import jsonify, request
from model.answer import Answer
from util.assignment import fetch_assignment


@api.route('/v1/answer/<answer_id>', methods=['GET'])
def get_answer(answer_id):
    '''
## 获取用户回答

    GET /api/v1/answer/<answer_id>

Parameters:

* `answerId` (string, required) - 答案ID

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
* `answerList` (list of int) - 学生回答的选项列表
    '''
    answer_id = request.form.get('answerId')
    answer = Answer.get({
        Answer.Field._id: answer_id
    }, [
        Answer.Field.answerList
    ]).data
    assignment = fetch_assignment(answer.get(Answer.Field.assignmentId))
    return jsonify(stat=0, assignment=assignment, answerList=answer.get(Answer.Field.answerList))
