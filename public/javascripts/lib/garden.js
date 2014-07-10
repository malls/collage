(function () {
    'use strict';

    function prettyString(str) {
        if (str.indexOf('%20') >= 0) {
            str = str.replace('%20', ' ');
            return prettyString(str);
        } else {
            return str;
        }
    }

    var exports = {
        prettyString: prettyString
    };

    window.garden = exports;

})();