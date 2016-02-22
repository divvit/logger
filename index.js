'use strict';

var ConsoleLogger = require('./loggers/console');
var LogentriesLogger = require('./loggers/logentries');
var logPriorities = require('./log-priorities');

var RELOAD_ENV_INTERVAL = 30 * 1000;      // reload config from ENV every 30 sec

var LogService = function() {
   this.config = require('./config/default.json');

   // try to load from process.ENV
   this.loadConfigFromEnvironment();
   this.configureLoggers();

   // regulary check the environment for config updates
   setInterval(function() {
      this.loadConfigFromEnvironment();
   }.bind(this), RELOAD_ENV_INTERVAL);
};

LogService.prototype.loadConfigFromEnvironment = function() {
   if (process.env.DIVVIT_LOG_CONFIG) {
      this.config = JSON.parse(process.env.DIVVIT_LOG_CONFIG);
      this.configureLoggers();
   }
};

LogService.prototype.saveConfigInEnvironment = function() {
   process.env.DIVVIT_LOG_CONFIG = JSON.stringify(this.config);
};

LogService.prototype.configure = function(config) {
   this.config = require('./config/default.json');

   if (config) {
      // overwrite with the values we received
      Object.keys(config).forEach(function(key) {
         this.config[key] = config[key];
      }.bind(this));
   }

   this.saveConfigInEnvironment();
   this.configureLoggers();
};

LogService.prototype.configureLoggers = function() {
   this.loggers = [];

   if (this.config.loggers) {
      Object.keys(this.config.loggers).forEach(function(loggerKey) {
         var logger;
         switch (loggerKey) {
            case 'console':
               logger = new ConsoleLogger(this.config.loggers[loggerKey]);
               break;

            case 'logentries':
               logger = new LogentriesLogger(this.config.loggers[loggerKey]);
               break;
         }

         if (this.config.loggers[loggerKey].logLevel) {
            logger.logLevel = this.config.loggers[loggerKey].logLevel;
         } else {
            logger.logLevel = this.config.defaultLogLevel;
         }

         this.loggers.push(logger);

      }.bind(this));
   }
};

LogService.prototype.trace = function() {
   this.log('trace', this.normalizeArgs(arguments));
};

LogService.prototype.debug = function() {
   this.log('debug', this.normalizeArgs(arguments));
};

LogService.prototype.info = function() {
   this.log('info', this.normalizeArgs(arguments));
};

LogService.prototype.warn = function() {
   this.log('warn', this.normalizeArgs(arguments));
};

LogService.prototype.error = function() {
   this.log('error', this.normalizeArgs(arguments));
};

LogService.prototype.fatal = function() {
   this.log('fatal', this.normalizeArgs(arguments));
};

LogService.prototype.normalizeArgs = function(args) {
   // turn into array
   var argList = (args.length === 1 ? [args[0]] : Array.apply(null, args));

   var processedArgs = [];
   argList.forEach(function(arg) {
      if (arg && arg.stack) {
         // for errors
         processedArgs.push(arg.stack);
      } else {
         processedArgs.push(arg);
      }
   });

   return processedArgs;
};

LogService.prototype.log = function(logLevel, args) {
   if (this.loggers) {
      this.loggers.forEach(function(logger) {
         if (this.shouldLog(logger, logLevel)) {
            logger.log(logLevel, args);
         }
      }.bind(this));
   }
};

LogService.prototype.shouldLog = function(logger, logLevel) {
   if (logPriorities.indexOf(logLevel) >= logPriorities.indexOf(logger.logLevel))
      return true;
   else
      return false;
};

module.exports = new LogService();
