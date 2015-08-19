# -*- coding: utf-8 -*-
from copy import deepcopy
from model.lesson import Lesson
from model.student import Student


def fetch_lesson(lesson_id):
    lesson = Lesson.get({
        Lesson.Field._id: lesson_id
    })
    student_ids = deepcopy(lesson.data.get(Lesson.Field.studentList))
    lesson.data[Lesson.Field.studentList] = []
    for student_id in student_ids:
        student = Student.get({
            Student.Field._id: student_id
        }, [
            Student.Field._id,
            Student.Field.name,
            Student.Field.studentId
        ])
        lesson.data[Lesson.Field.studentList].append(student.data)
    return lesson.data
