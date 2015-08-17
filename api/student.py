# -*- coding: utf-8 -*-
from api import api
from flask import jsonify, request
from model.student import Student


@api.route('/v1/student', methods=['POST'])
def new_student():
    student_id = request.form.get('studentId')
    name = request.form.get('name', '')
    Student.new_student(name, student_id)
    return jsonify(stat=0, )
