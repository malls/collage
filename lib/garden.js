var crypto = require('crypto');

(function garden() {
    'use strict';

    function prettyString(str) {
        if (str.indexOf('%20') > -1) {
            str = str.replace('%20', ' ');
            return prettyString(str);
        } else {
            return str;
        }
    }

    //add something to ensure it starts with a letter and contains only letters and numbers
    function id(origin) {
        if (!isNaN(+origin) || typeof origin !== 'string'){
            return false;
        } else {
            return origin + crypto.randomBytes(5).toString('hex');
        }
    }

    module.exports = {
        prettyString: prettyString,
        id: id
    };

})();