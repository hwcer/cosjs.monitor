"use strict";
//并发机器人,模拟大量节点
process.env.NODE_ENV = 'production';

const client = require("./client");
const max = 200;
//create_spirit(opts);
for(let i=1;i<=max;i++){
    setTimeout(function () {
        client(i);
    },roll(100,20000) )
}



function roll() {
    let min,max;
    if (arguments.length > 1) {
        min = arguments[0];max = arguments[1];
    }
    else {
        min = 1;max = arguments[0];
    }
    if (min >= max) {
        return max;
    }
    let key = max - min + 1;
    let val = min + Math.floor(Math.random() * key);
    return val;
}