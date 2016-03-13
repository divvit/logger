Logging service
=========

Small library to abstract logging providers from the code. Features auto-reload of log levels.

## Installation

  npm install @divvit/logging --save

## Usage

  var logger = require('@divvit/logger');

  # the following step is optional
  logger.configure(app.get('logging'));

  # default values will be used and the log config will be shared across the process, so in most cases you can just start logging:
  logger.error('One argument');

  logger.debug('Several', 'arguments');

  logger.info({ object: 'as argument'});

  logger.warn(['array', 'as', 'argument']);

  // you can mix all of the above

## Tests

  npm test

## Contributing

Nino Ulsamer, Divvit AB

## Release History

* 1.0.0 Initial release
* 1.0.1 Log error stack trace if available
* 1.0.2 Bugfix: don't break when logging undefined
* 1.0.3 Added cleanup method to make sure we send last error event to logentries
* 1.0.4 Call logentries asynchronously
* 1.0.5 Bugfix for logentries sending
