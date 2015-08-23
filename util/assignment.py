# -*- coding: utf-8 -*-
from config import UPLOAD_AUDIO_DIRECTORY
from model.assignment import Assignment
from model.question import Question


def check_answer(assignment_id, answer_list):
    assignment = Assignment.get({
        Assignment.Field._id: assignment_id
    }, [
        Assignment.Field.questionList
    ])
    question_ids = assignment.data.get(Assignment.Field.questionList)
    score_per_question = 100.0 / len(question_ids)
    score = 0
    q_a = zip(question_ids, answer_list)
    for (question_id, answer) in q_a:
        question = Question.get({
            Question.Field._id: question_id
        }, [
            Question.Field.answer
        ])
        if answer == question.data.get(Question.Field.answer):
            score += score_per_question
    return score


def fetch_assignment(assignment_id):
    import os
    from mutagen.mp3 import MP3
    assignment = Assignment.get({
        Assignment.Field._id: assignment_id
    })
    question_ids = assignment.data.get(Assignment.Field.questionList)
    assignment.data[Assignment.Field.questionList] = []
    question_num = len(question_ids)

    assignment.data['questionNum'] = question_num
    counter = 1
    for question_id in question_ids:
        question = Question.get({
            Question.Field._id: question_id
        })
        filename_prefix = assignment_id + '_' + str(counter)
        filenames = os.listdir(UPLOAD_AUDIO_DIRECTORY)
        audio_length = 0.0
        for file_name in filenames:
            if file_name.startswith(filename_prefix) and file_name.endswith("mp3"):
                mp3_file = MP3(os.path.join(os.path.abspath(UPLOAD_AUDIO_DIRECTORY), file_name))
                audio_length = mp3_file.info.length
                break
        question.data['audioLength'] = audio_length
        counter += 1

        assignment.data[Assignment.Field.questionList].append(question.data)

    return assignment.data
