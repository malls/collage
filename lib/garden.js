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

    function id(origin) {
        return origin + crypto.randomBytes(5).toString('hex');
    }

    module.exports = {
        prettyString: prettyString,
        id: id
    };

})();