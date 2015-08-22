# -*- coding: utf-8 -*-
from api import api
from flask import redirect
from model.url import URL


@api.route('/s/<url_id>', methods=['GET'])
def get_long_url(url_id):
    url = URL.get({
        URL.Field.urlId: url_id
    })
    return redirect(url.data.get(URL.Field.originUrl), code=302)
