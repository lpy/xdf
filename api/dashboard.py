# -*- coding: utf-8 -*-
from api import api
from model.user import User
from flask import jsonify, request, render_template, redirect, url_for


@api.route('/v1/login', methods=['POST'])
def login():
    name = request.form.get('name', '')
    password = request.form.get('password', '')
    hash_password = User.get_hashed_password(password)
    user = User.get({
        User.Field.name: name,
        User.Field.password: hash_password
    })
    if user:
        #return render_template('dashboard.html', userId=user.data.get(User.Field._id))
        return redirect('/dashboard/dashboard.html')
    else:
        return jsonify(stat=1,), 401


@api.route('/login', methods=['GET'])
def login_page():
    return render_template('login.html')
