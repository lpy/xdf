# -*- coding: utf-8 -*-
from model.answer import Answer
from model.assignment import Assignment
from model.lesson import Lesson
from model.student import Student


def delete_student(student_id):
    student = Student.get({
        Student.Field._id: student_id
    }, [
        Student.Field.answerList,
        Student.Field.assignmentList,
        Student.Field.lessonId
    ])
    Lesson.collection.update({
        Lesson.Field._id: student.data.get(Student.Field.lessonId)
    }, {
        '$pull': {
            Lesson.Field.studentList: student_id
        }
    })
    for assignment_id in student.data.get(Student.Field.assignmentList):
        Assignment.remove({
            Assignment.Field._id: assignment_id
        })
    for answer_id in student.data.get(Student.Field.answerList):
        Answer.remove({
            Answer.Field._id: answer_id
        })
    Student.remove({
        Student.Field._id: student_id
    })
