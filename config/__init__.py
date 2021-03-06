# -*- coding: utf-8 -*-


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

RELEASE_LINK = 'http://59.157.4.42'

UPLOAD_AUDIO_DIRECTORY = '/root/audios'
EXCEL_DIRECTORY = 'temp/'
ALLOWED_EXTENSIONS = set(['m4a', 'mp3', 'ogg'])

DEFAULT_EXPIRE = 4838400

SHORT_URL_HOST = 'http://59.157.4.42/s/'
AUDIO_URL = 'http://59.157.4.42/audio/'
