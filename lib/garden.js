var crypto = require('crypto');

(function garden() {
    'use strict';

    //replaces %20 in strings with a space
    function prettyString(str) {
        if (str.indexOf('%20') > -1) {
            str = str.replace('%20', ' ');
            return prettyString(str);
        } else {
            return str;
        }
    }

    function uglyString(str) {
        if (str.indexOf(' ') > -1) {
            str = str.replace(' ', '%20');
            return uglyString(str);
        } else {
            return str;
        }
    }

    // generates an id for images
    function id(origin) {
        //add something to ensure it starts with a letter and contains only letters and numbers
        if (!isNaN(+origin) || typeof origin !== 'string'){
            console.log('garden.id requires inputs to be valid as image IDs')
            return false;
        } else {
            return origin + crypto.randomBytes(5).toString('hex');
        }
    }

    module.exports = {
        prettyString: prettyString,
        uglyString: uglyString,
        id: id
    };

})();