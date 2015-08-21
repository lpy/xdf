from config import UPLOAD_AUDIO_DIRECTORY, ALLOWED_EXTENSIONS
from flask import Blueprint, jsonify, request


api = Blueprint('api', __name__, template_folder='template')


@api.errorhandler(400)
def handler_400(e):
    return jsonify(stat=0, err=0, msg='Bad Request'), 400


@api.errorhandler(401)
def handler_401(e):
    return jsonify(stat=0, err=1, msg='Unauthorized'), 403


@api.errorhandler(403)
def handler_403(e):
    return jsonify(stat=0, err=2, msg='Forbidden'), 403


@api.errorhandler(404)
def handler_404(e):
    return jsonify(stat=0, err=3, msg='Not Found'), 404


@api.route('/github/push', methods=['POST'])
def github_push():
    import os, subprocess
    subprocess.Popen('git pull', cwd=os.getcwd(), shell=True)
    return 'ok'


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@api.route('/v1/audio', methods=['POST'])
def upload_file():
    import os
    assignment_id = request.form.get('assignmentId')
    id = request.form.get('id')
    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = assignment_id + '_' + id + '.' + file.filename.rsplit('.', 1)[1]
        file.save(os.path.join(UPLOAD_AUDIO_DIRECTORY, filename))
        return jsonify(stat=1)


# Define error code
ERROR_GLOBAL = 0000
ERROR_USER = 1000
ERROR_ANSWER = 2000
ERROR_COMMENT = 3000
ERROR_PROBLEM = 4000
ERROR_CLASS = 5000
ERROR_VIDEO = 6000
ERROR_STUDIO = 7000
ERROR_ARTICLE = 8000

class GlobalError:
    pass


import answer
import assignment
import dashboard
import lesson
import question
import student
