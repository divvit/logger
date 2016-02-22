var chai = require('chai'),
   expect = chai.expect,
   should = require('chai').should(),
   sinon = require('sinon'),
   sinonChai = require('sinon-chai'),
   proxyquire =  require('proxyquire').noPreserveCache();

chai.use(sinonChai);

describe('logging', function() {

   beforeEach(function() {
      sinon.spy(console, 'log');
   });

   afterEach(function() {
      console.log.restore();
   });

   describe('logging', function() {
      it('should log error stack if available', function() {
         var consoleLoggerStub = function() {
            return {
               log: function(logLevel, message) {
                  console.log(message);
               }
            };
         }
         var logger = proxyquire('./../index', { './loggers/console': consoleLoggerStub } );

         try {
            throw new Error("Something unexpected has occurred.");
         } catch (err) {
            logger.error(err);
         }

         expect(console.log).to.be.called;

         // make sure we can see signs of a stack trace
         console.log.getCalls()[0].args[0][0].should.contain(' at ');

      });

      it('should not crash when logging "undefined"', function() {
         var logger = require('./../index');

         logger.debug(undefined);
      });
   });
});
