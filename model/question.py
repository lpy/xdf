# -*- coding: utf-8 -*-
from model import Collection, db


class Question(Collection):
    '''
* `_id` (string)
* `answer` (int) - 该问题的答案，答案下标从零开始
* `answerContent` (string) - 问题的答案解析内容
* `assignmentId` (string) - 问题所属的作业 ID
* `audio` (string) - 音频链接
* `content` (string) - 问题的内容
* `optionList` (list of string) - 问题的选项列表

    '''

    collection = db.question

    class Field:
        _id = '_id'
        answer = 'answer'
        answerContent = 'answerContent'
        assignmentId = 'assignmentId'
        audio = 'audio'
        content = 'content'
        optionList = 'optionList'

    class Analysis(object):
        accuracy = 'accuracy'

    @staticmethod
    def new_question(assignment_id, content, option_list,
                     answer, answer_content, audio):
        return Question.insert({
            Question.Field.assignmentId: assignment_id,
            Question.Field.accuracy: 0.0,
            Question.Field.content: content,
            Question.Field.optionList: option_list,
            Question.Field.answer: answer,
            Question.Field.answerContent: answer_content,
            Question.Field.audio: audio
        })
