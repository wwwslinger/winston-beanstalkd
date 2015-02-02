/*
 * beanstalkd.js: Transport for outputting to the Beanstalkd work queue
 * http://kr.github.io/beanstalkd/
 * 
 * (C) 2015 Jason McInerney
 * MIT LICENSE
 *
 */

var bs = require('nodestalker'),
    util = require('util'),
    winston = require('winston');

//
// ### function Beanstalkd (options)
// #### @options {Object} Options for this instance.
// Constructor function for the Beanstalkd transport object responsible
// for persisting log messages and metadata to a Beanstalkd work queue.
//
var Beanstalkd = exports.Beanstalkd = function (options) {
  winston.Transport.call(this, options);
  options = options || {};

  this.defaultTransformMessage = function(level, msg, meta) {
    if (!typeof msg == 'string') msg = this.stringify(msg);
    return { 'level': level, 'text': msg, 'meta': meta };
  };

  this.host             = options.host             || false;
  this.port             = options.port             || 11300;
  this.tube             = options.tube             || 'winston.log';
  this.delay            = options.delay;
  this.priority         = options.priority;
  this.ttr              = options.ttr;
  this.level            = options.level            || 'info';
  this.levelFilter      = options.levelFilter      || false;
  this.silent           = options.silent           || false;
  this.transformMessage = options.transformMessage || this.defaultTransformMessage;

  this.stringify = options.stringify || function (obj) {
    return JSON.stringify(obj);
  };

  if (!options.host) {
    throw new Error('Cannot connect to Beanstalkd without a host.');
  }
};

//
// Inherit from `winston.Transport`.
//
util.inherits(Beanstalkd, winston.Transport);

//
// Expose the name of this Transport on the prototype
//
Beanstalkd.prototype.name = 'beanstalkd';

//
// ### function log (level, msg, [meta], callback)
// #### @level {string} Level at which to log the message.
// #### @msg {string} Message to log
// #### @meta {Object} **Optional** Additional metadata to attach
// #### @callback {function} Continuation to respond to when complete.
// Core logging method exposed to Winston. Metadata is optional.
//
Beanstalkd.prototype.log = function (level, msg, meta, callback) {
  if (this.silent) {
    return callback(null, true);
  }
  var client;
  try {
    client = bs.Client(this.host + ':' + this.port);
  } catch (err) {
    throw err;
  }
  if (client) {
    var job = this.transformMessage(level, msg, meta);
    var tube = this.tube;
    if (this.levelFilter) tube += "." + this.level;
    var self = this;
    client.use(tube).onSuccess(function(data) {
      client.put(self.stringify(job), self.priority, self.delay, self.ttr).onSuccess(function(data) {
        console.log("closing...");
        client.disconnect();
        self.emit('logged');
        callback(null, true);
      }).onError(function(err) { self.emit('error', err); });
    }).onError(function(err) { self.emit('error', err); });
  }
};