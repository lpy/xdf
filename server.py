# -*- coding: utf-8 -*-
from gevent import monkey
# monkey.patch_all()

from api import api
from base64 import b64encode
from config import DEBUG
from flask import Flask
from gevent.wsgi import WSGIServer
from uuid import uuid4


app = Flask(__name__, static_path='/static', static_folder='public-src')
app.secret_key = b64encode(uuid4().hex)
app.debug = DEBUG
app.register_blueprint(api, url_prefix='/api')


# For health test
@app.route('/')
def index():
    return ''


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
