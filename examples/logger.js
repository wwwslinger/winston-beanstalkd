/*
 * Publish any winston logs to a Beanstalkd server
 * First start watch.js and then logger.js to see log messages
 *
 * (C) 2015 Jason McInerney
 * MIT LICENCE
 *
 */

var winston = require('winston'),
    Beanstalkd = require('winston-beanstalkd').Beanstalkd;

winston.cli();

// No options are required (see source code for defaults).
// Be careful with overwriting the default tube name since the will  
// change the tube name for every watcher.
var options = {
  'host': '0.0.0.0' // default
};

winston.add(Beanstalkd, options);

winston.log('info', 'Beanstalkd log event!');
winston.log('info', { "data": "You can log objects" });
winston.log('warn', 'This is a warning!');
winston.log('error', 'This is an error!', { code: '505', anything: 'This is metadata'});

for(var i=0; i<5; i++) {
  winston.log('help', 'Log number ' + i);
}
