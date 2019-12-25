"use strict";
//master服务器信息
let config = {
    "secret"  :'123456',
    "update"  :{'ts':9,'gid':'test','port':8080},
    "server"  :"http://127.0.0.1:3000",
}

let monitor = require('cosjs.monitor');

let socket = monitor.spirit(config);
socket.on('message',function () {
    //Array.prototype.unshift.call(arguments,'message')
    //console.log.apply(console,arguments)
})
socket.on('connect', () => {
    console.log('connect')
});
socket.on('disconnect', () => {
    console.log('disconnect')
});
socket.on('reconnecting', (attemptNumber) => {
    console.log('reconnecting',attemptNumber)
});


socket.on("loadavg",function(room,sid,data){
    //console.log('loadavg',room,sid,JSON.stringify(data))
});

socket.on("online",function(room,sid,data){
    console.log('online',room,sid,JSON.stringify(data))
});

socket.on("offline",function(room,sid){
    console.log('offline',room,sid)
});