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

    module.exports = {
        prettyString: prettyString
    };

})();