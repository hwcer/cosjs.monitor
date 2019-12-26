/*
{'ts':1,'avg':2,'port':3000,'route':'/ss/',url:'',secret:'',update:{}}
 */
const os = require('os');
const library    = require('cosjs.library');
const querystring = require('querystring');
const server_rooms = new Map();

module.exports = function(opts){
    let url,query = socket_url_data(opts),heartbeat = opts.heartbeat||5000;
    let server = opts['server'];
    if(opts['namespace']){
        server = [server,opts['namespace']].join('/');
    }
    if(server.indexOf('?') < 0){
        url = server + '?' + query;
    }
    else{
        url = server + '&' + query;
    }

    let socket = require('socket.io-client')(url);
    setInterval(function () {
        socket.emit('loadavg',os.loadavg());  //广播服务器压力 win32系统始终为0
    },heartbeat);
    //初次进入,更新所有
    socket.on("update",function(arr){
        for(let d of arr){
            server_rooms.set(d['id'],d);
        }
    });
    //服务器心跳
    socket.on("loadavg",function(id,avg){
        if(server_rooms.has(id)){
            let d = server_rooms.get(id);
            d['avg'] = avg;
        }
        else{
            socket.emit("refresh",id);
        }
    });

    socket.on("online",function(id,data){
        server_rooms.set(id,data);
    });

    socket.on("offline",function(id){
        server_rooms.delete(id);
    });
    //获得更新回应
    socket.on("refresh",function(id,data){
        server_rooms.set(id,data);
    });


    return socket;
}

module.exports.page = function(){
    let arr = [];
    for(let [id,data] of server_rooms){
        arr.push(data);
    }
    return arr;
}

//服务器筛选
module.exports.select = function server_select(ts,sid,avg){
    let pub=[],pri=[],time = Date.now();
    for( let [k,v] of server_rooms){
        if( v['ts'].indexOf(ts) < 0 ){
            continue;
        }
        if( avg > 0 && v['avg'][0] > avg){
            continue;
        }
        // if( socket.connected && socket.pingTimeout > 0 && ( time - v['time']) > socket.pingTimeout){
        //     continue;
        // }
        //sid判断
        if( sid && v.sid.indexOf(sid) >=0 ){
            pri.push(server_package(k,v));
        }
        else if( !sid || v.sid.length === 0 ){
            pub.push(server_package(k,v));
        }
    }
    let arr = pri.length > 0 ? pri : pub;
    if(arr.length < 1){
        return null;
    }
    else if(arr.length === 1){
        return arr[0];
    }
    let limit = 5;
    if(arr.length > 5){
        arr.sort((a,b)=>a.avg-b.avg);
    }
    let max = Math.min(limit,arr.length);
    let i = library('random/Roll',0,max-1);
    return arr[i];
}




function socket_url_data(opts) {
    let update = opts['update'];
    update['ts'] = Array.isArray(update['ts']) ? update['ts'] : [update['ts']];
    update['avg'] = os.loadavg();

    if(Array.isArray(update['sid'])){
        update['sid'] = update['sid']
    }
    else if(update['sid']){
        update['sid'] = [update['sid']];
    }
    else {
        update['sid'] = [];
    }
    let data = {"update":JSON.stringify(update)}
    data['secret'] = opts.secret;
    return querystring.stringify(data);
}



function server_package(k,v) {
    if(!v){
        return null;
    }
    else {
        return {"ip":v.ip,"port":v.port,"avg":v.avg};
    }
}