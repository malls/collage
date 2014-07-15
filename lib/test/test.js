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

  describe('uglyString', function () {
    it('should return a string', function () {
      assert.equal('string', typeof garden.uglyString("hi there"));
    });

    it('should return the same string if there are no pretty spaces', function () {
        assert.equal('abc', garden.uglyString('abc'));
        assert.equal('1000', garden.uglyString('1000'));
    });
    
    it('should remove pretty spaces from a string', function () {
        assert.equal('abc%20123', garden.uglyString('abc 123'));
        assert.equal('%20', garden.uglyString(' '));
        assert.equal('Hello%20world!%20%20', garden.uglyString('Hello world!  '));
    });
  
  });

  describe('id', function () {
    it('should return a string', function () {
        assert.equal('string', typeof garden.id('a'));
    });

    it('should begin with the input', function () {
        assert.equal('a', garden.id('a')[0]);
    });

    it('should reject a number, object, or array input', function () {
      assert.equal(false, garden.id('100'));
      assert.equal(false, garden.id({object: true}));
      assert.equal(false, garden.id([{}, true, garden.id]));
    });

  });

});