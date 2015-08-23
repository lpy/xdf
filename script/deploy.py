# -*- coding: utf-8 -*-
import os, sys
sys.path.append(os.getcwd())


from model.answer import Answer
from model.assignment import Assignment
from model.lesson import Lesson
from model.question import Question
from model.student import Student
from model.url import URL
from model.user import User
from model.user_token import UserToken


def clearAll():
    Answer.remove({})
    Assignment.remove({})
    Lesson.remove({})
    Question.remove({})
    Student.remove({})
    URL.remove({})
    User.remove({})

def createAdmin():
    User.new_admin("admin", "nimda")


def insertAssignment():
    pass


def insertLesson():
    pass


if __name__ == '__main__':
    # clearAll()
    createAdmin()
