# -*- coding: utf-8 -*-
from api import api
from model.user import User
from model.user_token import UserToken
from flask import jsonify, request, render_template, redirect
from flask.ext.login import login_user, make_secure_token
from uuid import uuid4


@api.route('/v1/login', methods=['POST'])
def login():
    name = request.form.get('name', '')
    password = request.form.get('password', '')
    hash_password = User.get_hashed_password(password)
    user = User.get({
        User.Field.name: name,
        User.Field.password: hash_password
    })
    token = unicode(make_secure_token(user.data[User.Field._id],
                                      user.data[User.Field.password],
                                      uuid4().hex))
    UserToken.update_token(user.data[User.Field._id], token)
    if user:
        #return render_template('dashboard.html', userId=user.data.get(User.Field._id))
        login_user(user)
        return redirect('/dashboard/dashboard.html')
    else:
        return jsonify(stat=1,), 401


@api.route('/login', methods=['GET'])
def login_page():
    return render_template('login.html')
