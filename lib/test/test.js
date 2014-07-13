var assert = require('assert'),
  garden = require('../garden');

describe('garden', function () {

  describe('prettyString', function () {

    it('should return the same string if there are no ugly spaces', function () {
        assert.equal('abc', garden.prettyString('abc'));
        assert.equal('1000', garden.prettyString('1000'));
    });

    it('should remove ugly spaces from a string', function () {
        assert.equal('abc 123', garden.prettyString('abc%20123'));
        assert.equal(' ', garden.prettyString('%20'));
        assert.equal('Hello world!  ', garden.prettyString('Hello%20world!%20%20'));
    });

  });

  describe('id', function () {
    it('should return a string', function () {
        assert.equal('string', typeof garden.id('a'));
    });

    it('should begin with the input', function () {
        assert.equal('a', garden.id('a')[0]);
    });

  });

});