# -*- coding: utf-8 -*-

# Rename this file to `__init__.py`

DEBUG = True

# Full mongodb URI: 'addr:port'
HOST = 'localhost:27017'

# Set AUTH to True if target instance needs authentication, otherwise set AUTH
# to False and comment the USER and PWD lines.
AUTH = False
# USER = ''
# PWD = ''


DEBUG_IP = '0.0.0.0'
DEBUG_PORT = 5001

NONDEBUG_IP = 'localhost'
NONDEBUG_PORT = 5001

RELEASE_LINK = ''

UPLOAD_AUDIO_DIRECTORY = ''
EXCEL_DIRECTORY = 'temp/'
ALLOWED_EXTENSIONS = set(['m4a', 'mp3'])

DEFAULT_EXPIRE = 4838400

SHORT_URL_HOST = ''
AUDIO_URL = ''
