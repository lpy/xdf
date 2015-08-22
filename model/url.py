# -*- coding: utf-8 -*-
from config import DEFAULT_EXPIRE
from datetime import datetime
from model import Collection, db
import base64


class URL(Collection):

    collection = db.shorturl

    class Field(object):
        _id = '_id'
        originUrl ='originUrl'
        assignmentId = 'assignmentId'
        studentId = 'studentId'
        createTime = 'createTime'
        urlId = 'urlId'

    collection.ensure_index(Field.createTime, expireAfterSeconds=DEFAULT_EXPIRE)

    @staticmethod
    def generate_short_url(origin_url, assignment_id, student_id):
        import hashlib
        md5 = hashlib.md5()
        md5.update(origin_url)
        short_url = base64.b64encode(md5.digest()[-4:]).replace('=','').replace('/','_')
        url_id = short_url
        counter = 1
        while True:
            try:
                URL.get({
                    URL.Field.assignmentId: assignment_id,
                    URL.Field.studentId: student_id,
                    URL.Field.urlId: url_id
                })
                return url_id
            except:
                try:
                    URL.get({
                        URL.Field.urlId: url_id
                    })
                    url_id = short_url + str(counter)
                    counter += 1
                except:
                    URL.insert({
                        URL.Field.assignmentId: assignment_id,
                        URL.Field.studentId: student_id,
                        URL.Field.urlId: url_id,
                        URL.Field.originUrl: origin_url,
                        URL.Field.createTime: datetime.now()
                    })
                    return url_id
