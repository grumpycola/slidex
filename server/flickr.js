/*!
 * flickr.js - flickr api
 * http://mobile.rdacorp.com/
 *
 * Copyright (c) 2011 eka renardi
 * Dual licensed under the MIT and GPL licenses.
 */


var http = require('http'),
    sys = require('sys'),
    utils = require('./utils');


var Flickr = module.exports = exports = function Flickr(api_key) {
  if (!api_key) throw Error("api_key required");
  this.api_key = api_key;
  this.host = 'api.flickr.com';
  this.port = 80;
  this.per_page = 25;
};


exports.createFlickr = function( api_key ) {
  return new Flickr( api_key );
};

Flickr.prototype._request = function(method, args, callback) {
  
  var defaults = {
    method: method,
    format: 'json',
    nojsoncallback: 1,
    api_key: this.api_key
  };
  var params = [];
  for (var key in defaults) {
    params.push( key + "=" + defaults[key] );
  }
  for (var key in args) {
    params.push( key + "=" + args[key] );
  }
  var url = "http://" + this.host + "/services/rest/?" + params.join('&');
  sys.puts( url );

  var headers = {
    'accept' : '*/*',
    'host' : this.host,
  };

  var req = http.createClient( this.port, this.host ).request( 'POST', url, headers );
  req.addListener('response', function(response) {
    
    var body = '';
    response.setEncoding('utf8');
    
    response.on('data', function(chunk) { 

      if (response.statusCode != 200) {
        callback( {stat: 'error', code: response.statusCode, message: 'response_on_data error'} );
        req.abort();
      } else {
        body += chunk;
      }

    });

    response.on('end', function() {

      var data = JSON.parse(body);
      if ( data.stat && data.stat == 'ok' ) {
        // strip out stat
        for (var key in data) {
          if (key !== 'stat') {
            data = data[key];
          }
        }
        callback( null, data );
      } else {
        callback( {stat: 'error', code: data.code, message: data.message} );
      }

    });

  });
  req.end();
};




Flickr.prototype.search = function(term, args, callback) {
  
  var args = args || {};
  var defaults = { privacy_filter:1, per_page:this.per_page, extras:'description,owner_name,url_m', text:term };

  var req = this._request(
      'flickr.photos.search', 
      utils.merge( defaults, args ), 
      callback);
};



Flickr.prototype.getInfo = function(photo_id, secret, callback) {
  
  var args = { photo_id: photo_id, secret: secret };

  var req = this._request(
      'flickr.photos.getInfo', 
      args, 
      callback);
};


Flickr.prototype.interestingness = function(date, args, callback) {

  var defaults = { date: date, per_page:this.per_page, extras:'owner_name,url_m' };

  var req = this._request(
      'flickr.interestingness.getList', 
      utils.merge( defaults, args ),
      callback);
  
};


