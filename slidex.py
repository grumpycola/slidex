#!/usr/bin/env python
# -*- coding: utf-8 -*-

import pdb
import os.path
import tornado.ioloop
import tornado.httpserver
import tornado.options
import tornado.web
from tornado.options import define, options
from urllib import urlencode, urlopen

define("port", default=8888, help="run on the gien port", type=int)
define("host", default="http://flickr.com/services/rest", help="flickr url")
define("api_key", default="2c0e6e85e151c48a63c918bae3406739")
define("api_secret", default="02fea3624f430de9")

class FlickrError(Exception): pass

class Application(tornado.web.Application):
    def __init__(self):
	handlers = [
		(r"/", MainHandler),
		(r"/search/([^/]+)", SearchHandler),
		(r"/photo/([^/]+)/([^/]+)", PhotoInfoHandler),
	]
        settings = dict(
		template_path=os.path.join(os.path.dirname(__file__), "templates"),
		static_path=os.path.join(os.path.dirname(__file__), "static"),
	)
        tornado.web.Application.__init__(self, handlers, **settings)
     
            
class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

             

class SearchHandler(tornado.web.RequestHandler):
	def get(self, text):
		data = _get("flickr.photos.search", privacy_filter=1, text=text)
		return data

	
	
class PhotoInfoHandler(tornado.web.RequestHandler):
	def get(self, id, secret):
		data = _get("flickr.photos.getinfo", photo_id=id, secret=secret)
		return data

		

def _get(method, **params):
	params = _params(params)
	url = '%s/?method=%s&format=json&nojsoncallback=1&api_key=%s&%s' % (options.host, method, options.api_key, urlencode(params))
	f = urlopen(url)
	buff = f.read()
	f.close()
	return buff


def _params(params):
	for (key, value) in params.items():
		if isinstance(value, list):
			params[key] = ','.join([item for item in value])
	return params


def main():
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()