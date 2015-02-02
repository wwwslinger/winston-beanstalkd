# winston-beanstalkd
A [Beanstalkd][0] transport for [winston][0].

[![NPM version](https://img.shields.io/npm/v/winston-beanstalkd.svg)](https://www.npmjs.org/package/winston-beanstalkd) ![MIT License](http://img.shields.io/badge/license-MIT-green.svg)

## Motivation
To enable a log-based work queue compatible with existing logging mechanisms.

## Usage
``` js
  var winston = require('winston');
  
  //
  // Requiring `winston-beanstalkd` will expose 
  // `winston.transports.Beanstalkd`
  //
  require('winston-beanstalkd').Beanstalkd;
  
  winston.add(winston.transports.Beanstalkd, options);
```

The Beanstalkd transport takes the following options. 'host' is required:

* __level:__ Level of messages that this transport should log, defaults to
'info'.
* __silent:__ Boolean flag indicating whether to suppress output, defaults to
false.
* __host:__ The host running Beanstalkd, defaults to localhost.
* __port:__ The port on the host that Beanstalkd is running on, defaults to
11300.
* __tube:__ The name of the tube you want to log to, defaults to 'winston.log'. See [beanstalkd FAQ][2].
* __delay:__ See the [beanstalkd FAQ][2].
* __priority:__ See the [beanstalkd FAQ][2].
* __ttr:__ See the [beanstalkd FAQ][2].
* __levelFilter:__ Whether to append the logging level to the tube name to filter on log level.
* __transformMessage:__ A custom function for transforming logged objects to a queue string, defaults to JSON.stringify().

## Installation

### Installing npm (node package manager)

``` bash
  $ curl http://npmjs.org/install.sh | sh
```

### Installing winston-beanstalkd

``` bash
  $ npm install winston
  $ npm install winston-beanstalkd
```

## Usage

See the examples for a logger and a watcher.

In one console, start the watcher:
```bash
  $ node examples/watch.js
Watching for logs on winston.log...
```

In another console, run the logger:
```bash
  $ node examples/logger.js
info:   Beanstalkd log event!
info:   [object Object]
warn:   This is a warning!
error:  This is an error! code=505, anything=This is metadata
help:   Log number 0
help:   Log number 1
help:   Log number 2
help:   Log number 3
help:   Log number 4
closing...
closing...
closing...
closing...
closing...
closing...
closing...
closing...
closing...
```
Return to the watcher console and see the output from processing the log entries:
```bash
  $ node examples/watch.js
Watching for logs on winston.log...
received log: { id: '113', data: '{"level":"help","text":"  Log number 1"}' }
processing log entry...
processed: true { id: '113', data: '{"level":"help","text":"  Log number 1"}' }
deleted { id: '113', data: '{"level":"help","text":"  Log number 1"}' }
[ 'DELETED' ]
Watching for logs on winston.log...
received log: { id: '114', data: '{"level":"help","text":"  Log number 2"}' }
processing log entry...
processed: true { id: '114', data: '{"level":"help","text":"  Log number 2"}' }
deleted { id: '114', data: '{"level":"help","text":"  Log number 2"}' }
[ 'DELETED' ]
Watching for logs on winston.log...
received log: { id: '115', data: '{"level":"help","text":"  Log number 3"}' }
processing log entry...
processed: true { id: '115', data: '{"level":"help","text":"  Log number 3"}' }
deleted { id: '115', data: '{"level":"help","text":"  Log number 3"}' }
[ 'DELETED' ]
Watching for logs on winston.log...
received log: { id: '116', data: '{"level":"help","text":"  Log number 4"}' }
processing log entry...
processed: true { id: '116', data: '{"level":"help","text":"  Log number 4"}' }
deleted { id: '116', data: '{"level":"help","text":"  Log number 4"}' }
[ 'DELETED' ]
Watching for logs on winston.log...
process callback
process callback
process callback
process callback
process callback
process callback
process callback
process callback
process callback
```

#### Author: Jason McInerney

[0]: https://github.com/kr/beanstalkd
[1]: https://github.com/flatiron/winston
[2]: https://github.com/kr/beanstalkd/wiki/faq
