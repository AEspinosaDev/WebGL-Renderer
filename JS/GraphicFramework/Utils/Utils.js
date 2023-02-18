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
            callback(request.responseText);
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



Utils.loadJson = function (url, callback) {
    var root = this,
        xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        callback && callback(this.response);
    };
    xhr.send(null);

};
// function loadShadersAndRunDemo() {
//     var vsxml = new XMLHttpRequest();
//     vsxml.open('GET', 'vertexshader.glsl');
//     vsxml.onLoad = function (vsText) {
//       var fsxml = new XMLHttpRequest();
//       fsxml.open('GET', 'fragmentshader.glsl');
//       fsxml.onLoad = function (fsText) {
//         runDemo(vsText, fsText);
//       };
//       fsxml.send();
//     };
//     vsxml.send();
//   }


