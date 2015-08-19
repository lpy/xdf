from flask import Blueprint, jsonify

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
