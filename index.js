"use strict";

exports.server = require('./lib/server');

exports.spirit = require('./lib/spirit');


exports.plugin = function () {
    let path =  __dirname + '/plugin';
    return require("cosjs.mvc").plugin.add(path,...arguments,false);
}