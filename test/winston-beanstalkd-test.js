/*
 * winston-amqp-test.js: Tests for instances of the AMQP transport
 *
 * (C) 2011 Krispin Schulz
 * MIT LICENSE
 *
 */

var path = require('path'),
    vows = require('vows'),
    assert = require('assert'),
    winston = require('winston'),
    helpers = require('winston/test/helpers'),
    Beanstalkd = require('../lib/winston-beanstalkd').Beanstalkd;

var config = helpers.loadConfig(__dirname);

vows.describe('winston-beanstalkd').addBatch({
 "An instance of the Beanstalkd Transport": {
    b: function() {
      return winston.transport(Beanstalkd, config.transports.beanstalkd);
    },
    "is an instance of the Beanstalkd transport": function(b) {
      assert.instanceOf(b, Beanstalkd);
    },
    "has a log function defined": function (b) {      
      assert.isFunction(b.log);
    },
    "properly sets the host name default": function(b) {
      assert.equal(b.host, false);
    },
    "properly sets the port default": function(b) {
      assert.equal(b.port, 11300);
    },
    "properly sets the tube default": function(b) {
      assert.equal(b.tube, "winston.log");
    }
  },
  "An Beanstalkd Transport instance with a minimum custom definition": {
    b: function() {
      return new (Beanstalkd)({
        host: "10.0.0.1",
        port: 11301,
        tube: "winston.testlog"
      });
    },
    "properly sets the host name": function(b) {
      assert.equal(b.host, "10.0.0.1");
    },
    "properly sets the port": function(b) {
      assert.equal(b.port, 11301);
    },
    "properly sets the tube": function(b) {
      assert.equal(b.tube, "winston.testlog");
    }
  },
  "An Beanstalkd Transport instance with a full custom definition": {
    b: function() {
      return new (Beanstalkd)({
        host: "10.0.0.1",
        port: 11301,
        tube: "winston.testlog",
        priority: 11,
        delay: 32,
        ttr: 12,
        level: 'debug',
        silent: true
      });
    },
    "properly sets the host name": function(b) {
      assert.equal(b.host, "10.0.0.1");
    },
    "properly sets the port": function(b) {
      assert.equal(b.port, 11301);
    },
    "properly sets the tube": function(b) {
      assert.equal(b.tube, "winston.testlog");
    },
    "properly sets the priority": function(b) {
      assert.equal(b.priority, 11);
    },
    "properly sets the delay": function(b) {
      assert.equal(b.delay, 32);
    },
    "properly sets the ttr": function(b) {
      assert.equal(b.ttr, 12);
    },
    "properly sets the level": function(b) {
      assert.equal(b.level, 'debug');
    },
    "properly sets the ttr": function(b) {
      assert.equal(b.silent, true);
    }
  },
  "An Beanstalkd Transport instance with no custom transform message function specified": {
    b: function() {
      return new (Beanstalkd)();
    },
    "uses the default message transform function": function(b) {
      var level = "info"
        , msg = "my message"
        , meta = { propertyName: "propertyValue" };

      var actualTransformedMessage = b.transformMessage(level, msg, meta)
        , expectedTransformedMessage = b.defaultTransformMessage(level, msg, meta);

      assert.deepEqual(actualTransformedMessage, expectedTransformedMessage);
    }
  },
  "An Beanstalkd Transport instance with a custom transform message function specified": {
    b: function() {
      return new (Beanstalkd)({
        transformMessage: function(level, msg, meta) {
          return level + "::" + msg + "::" + JSON.stringify(meta);
        }
      });
    },
    "uses the custom transform message function": function(b) {
      var level = "info"
        , msg = "my message"
        , meta = { propertyName: "propertyValue" };

      var actualTransformedMessage = b.transformMessage(level, msg, meta)
        , expectedTransformedMessage = "info::my message::{\"propertyName\":\"propertyValue\"}";

      assert.equal(actualTransformedMessage, expectedTransformedMessage);
    }
  }
}).export(module);

