var assert = require('assert');
var cash = require('./cash');

describe('Cash', function() {
    describe('#getProductByCode()', function() {
        it('should throw error when code not in codeDict', function() {
            assert.throws(function(){
                cash.getProductByCode('ITEM000007');
                cash.getProductByCode('ITEM000003');
            }, Error);
        });
    });
});