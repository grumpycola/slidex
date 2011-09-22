/*!
 * server.js - main node class
 * http://mobile.rdacorp.com/
 *
 * Copyright (c) 2011 eka renardi
 * Dual licensed under the MIT and GPL licenses.
 */


var sys = require('sys'),
    http = require('http'),
    url = require('url'),
    qs = require('querystring'),
    flickr = require('./flickr'),
    utils = require('./utils'),
    router = require('choreographer').router();

var API_KEY = '2c0e6e85e151c48a63c918bae3406739';

router.get('/search/*', function(req, res, term) {

  utils.log( req, '/search' );

  // parse url into its component
  var obj = url.parse( req.url );
  var args = qs.parse( obj.query ) || {};

  var f = flickr.createFlickr( API_KEY );
  f.search(term, args, function(error, result) {

    if (error) {

      res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin' : '*'});
      res.end( JSON.stringify(error) );
      
    } else if (result) {

      res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin' : '*'});
      res.end( JSON.stringify(result) );

    }

  });
  
});

router.get('/interesting/*', function(req, res, date) {

  utils.log( req, '/interesting' );

  // parse url into its component
  var obj = url.parse( req.url );
  var args = qs.parse( obj.query ) || {};

  var f = flickr.createFlickr( API_KEY );
  f.interestingness(date, args, function(error, result) {

    if (error) {

      res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin' : '*'});
      res.end( JSON.stringify(error) );
      
    } else if (result) {

      res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin' : '*'});
      res.end( JSON.stringify(result) );

    }

  });  

});


router.get('/favicon.ico', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('\n');
});


router.notFound(function(req, res) {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('404: Web service not found.\n');
  utils.log( req, 'not found' );
});

http.createServer(router).listen(3000, "127.0.0.1");
sys.puts('server running at http://127.0.0.1:3000');
