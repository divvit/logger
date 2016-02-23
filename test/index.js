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

      it('should clean up', function(done) {
         this.timeout(10000);

         var logger = require('./../index');
         logger.configure({
            loggers: {
               logentries: {
                  token: 'dac6b4a1-18be-453e-80b9-f89fdf28254a'
               }
            }
         });

         logger.cleanup(function(err) {
            should.not.exist(err);

            done();
         });
      });
   });
});
