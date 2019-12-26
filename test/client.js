"use strict";
const library    = require('cosjs.library');


let opts = {
    "secret"  :'123456',    //秘钥,和服务器配置一样
    "update"  :{'ts':9,'port':8000,'ip':'127.0.0.1'},    //上报数据,ts;服务器类型,port:开放服务端口,ip:开放IP,默认自动获取内网IP, 其他自定义
    "server"  :"http://centos.hwc.com:80",               //服务器地址
    "namespace" : "test"                                 //所属名字空间
}


create_spirit();


function create_spirit(i=0) {
    let config = JSON.parse(JSON.stringify(opts));
    config['update']['port'] += i;

    let monitor = require('cosjs.monitor');

    let socket = monitor.spirit(config);
    socket.on('message', function () {
        //Array.prototype.unshift.call(arguments,'message')
        //console.log.apply(console,arguments)
    })
    socket.on('connect', () => {
        console.debug('connect')
    });
    socket.on('disconnect', () => {
        console.debug('disconnect')
    });
    socket.on('reconnecting', (attemptNumber) => {
        console.debug('reconnecting', attemptNumber)
    });


    socket.on("loadavg", function (sid, data) {
        //console.debug('loadavg',monitor.spirit.page())
    });

    socket.on("online", function (sid, data) {
        console.debug('online', sid, data)
    });

    socket.on("offline", function (sid) {
        console.debug('offline', sid)
    });

}


exports = module.exports = create_spirit;