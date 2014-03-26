'use strict';

var transformer = require('../lib/dotnet-config-transformer.js'),
    should = require('should'),
    settings = require('../settings.json'),
    testSettings = require('./test-settings.json');

describe('dotnetConfigTransformer', function(){

  this.timeout(testSettings.timeoutMs);

  before(function() {
    transformer.init(settings);
  });

  describe('transform', function(){
    it('should perform a transform', function(done) {

      var configXml = '<?xml version="1.0"?><configuration><connectionStrings><add name="foo" connectionString="value"/></connectionStrings><system.web><customErrors mode="Off"/></system.web></configuration>      ',
          transformXml = '<?xml version="1.0"?><configuration xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform"><xdt:Import assembly="AppHarbor.TransformTester" namespace="AppHarbor.TransformTester.Transforms"/><configSections xdt:Transform="MergeBefore(/configuration/*)" /><configSections><section name="mySection" xdt:Transform="Insert" /></configSections><connectionStrings xdt:Transform="Merge" /><connectionStrings><add name="bar" connectionString="value" xdt:Transform="Insert"/></connectionStrings><system.web><customErrors mode="On" xdt:Transform="Replace"></customErrors></system.web></configuration>      ',
          expected = '<?xml version="1.0"?><configuration><configSections><section name="mySection" /></configSections><connectionStrings><add name="foo" connectionString="value" /><add name="bar" connectionString="value" /></connectionStrings><system.web><customErrors mode="On"></customErrors></system.web></configuration>      ';

      transformer.transform(configXml, transformXml, function(err, result) {

        should.not.exist(err);
        result.should.be.ok;
        result.should.not.be.empty;
        result.replace(/\s/g, '').should.equal(expected.replace(/\s/g, ''));

        done();

      });

    });
  });
});
