"use strict";
//服务器端
exports.server = require('./lib/server');
//客户端
exports.spirit = require('./lib/spirit');


exports.plugin = function () {
    let path =  __dirname + '/plugin';
    return require("cosjs.mvc").plugin.add(path,...arguments,false);
}