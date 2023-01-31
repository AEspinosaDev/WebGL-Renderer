/**
 * @fileOverview Cross-browser utilities
 * @author Indigo Code
 */

export function Utils() { }


// Load a text resource from a file over the network
Utils.LoadTextResource = function (url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url + '?please-dont-cache=' + Math.random(), true);
    request.onload = function () {
        if (request.status < 200 || request.status > 299) {
            callback('Error: HTTP Status ' + request.status + ' on resource ' + url);
        } else {
            callback(null, request.responseText);
        }
    };
    request.send();
};

Utils.LoadImage = function (url, callback) {
    var image = new Image();
    image.onload = function () {
        callback(null, image);
    };
    image.src = url;
};

Utils.LoadJSONResource = function (url, callback) {
    this.LoadTextResource(url, function (err, result) {
        if (err) {
            callback(err);
        } else {
            try {
                callback(null, JSON.parse(result));
            } catch (e) {
                callback(e);
            }
        }
    });
};


