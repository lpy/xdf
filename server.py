# -*- coding: utf-8 -*-
from gevent import monkey
# monkey.patch_all()

from api import api
from base64 import b64encode
from config import DEBUG
from flask import Flask, render_template, redirect, send_from_directory
from flask.ext.login import LoginManager, login_required
from model.user import User
from model.user_token import UserToken
from gevent.wsgi import WSGIServer
from uuid import uuid4


app = Flask(__name__, static_path='/static', static_folder='public-src')
app.secret_key = b64encode(uuid4().hex)
app.debug = DEBUG
app.register_blueprint(api, url_prefix='/api')


login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = '/api/login'


@login_manager.user_loader
def load_user(user_id):
    return User.get({
        User.Field._id: user_id
    })


@login_manager.token_loader
def load_token(token):
    token = UserToken.get({
        UserToken.Field._id: token
    })

    if token:
        return User.get({
            User.Field._id: token.data.get(UserToken.Field.userId)
        })
    else:
        return None


# For health test
@app.route('/')
def index():
    return ''

@app.route('/login')
def redirect_to_login():
    return redirect('/api/login')


@app.route('/dashboard', methods=['GET'])
@login_required
def redirect_to_dashboard():
    return render_template('/dashboard.html')


@app.route('/dashboard/<path>')
@login_required
def serve_dashboard(path):
    return render_template('/{}'.format(path))


@app.route('/excel/<file_name>', methods=['GET'])
@login_required
def send_excel(file_name):
    from config import EXCEL_DIRECTORY
    import os
    return send_from_directory(os.path.abspath(EXCEL_DIRECTORY), file_name)


@app.route('/audio/<file_name>', methods=['GET'])
def send_audio(file_name):
    from config import UPLOAD_AUDIO_DIRECTORY
    import os
    return send_from_directory(os.path.abspath(UPLOAD_AUDIO_DIRECTORY), file_name)


if DEBUG:
    from werkzeug.serving import run_with_reloader
    from config import DEBUG_IP, DEBUG_PORT

    @run_with_reloader
    def run_server():
        http_server = WSGIServer((DEBUG_IP, DEBUG_PORT), app)
        http_server.serve_forever()
else:
    from config import NONDEBUG_IP, NONDEBUG_PORT
    http_server = WSGIServer((NONDEBUG_IP, NONDEBUG_PORT), app)
    http_server.serve_forever()
