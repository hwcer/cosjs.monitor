"use strict";
//前后端HTTP协议交互
//因为request 回调函数参数[err, res, body]问题无法直接转换成Promise模式
const mvc = require('cosjs.mvc');
const library = mvc.library.require('request');
//服务器筛选
exports = module.exports =  function(api,query){
    return Promise.resolve().then(()=>{
        let p = mvc.config.get("local.port")||8080;
        let arr = ['spirit',api];
        let prefix = mvc.plugin.get('spirit.prefix');
        if(prefix){
            let ks = Object.keys(query);
            let reg = new RegExp(ks.join('|'),'g');
            arr.unshift(prefix.replace(reg,  function (m){ return query[m]||m}  ) );
        }
        arr.unshift('');
        let key = arr.join('/');
        let uri = ['http://127.0.0.1',p].join(':')
        let url = [uri,key].join('');
        return library.post(url,query,true);
    }).then(ret=>mvc.library("promise/callback",ret) );
}
//选择服务器
exports.select = function(gid,ts,sid,avg){
    let query = {gid,ts,sid,avg};
    return exports('select',query);
}

//后台接口
exports.gzone = function(api,gid,sid,data){
    return exports.select(gid,9,sid).then(ret=>{
        if(!ret){
            return Promise.reject("server empty")
        }
        let url = `http://${ret['ip']}:${ret['port']}/${gid}${api}`;
        let secret = arguments[4] || mvc.plugin.get('spirit.secret');
        if(secret){
            mvc.library("sign/create",data,secret);
        }
        return library.post(url,data,true).then(ret=>mvc.library('promise/callback',ret))
    })
}
//后台游戏
exports.game = function(api,gid,sid,data){
    return exports.select(gid,1,sid).then(ret=>{
        if(!ret){
            return Promise.reject("server empty")
        }
        let url = `http://${ret['ip']}:${ret['port']}/s${sid}${api}`;
        let secret = arguments[4] || mvc.plugin.get('spirit.secret');
        if(secret) {
            mvc.library("sign/create", data,secret);
        }
        return library.post(url,data,true).then(ret=>mvc.library('promise/callback',ret))
    })
}

//战斗服
exports.battle = function(api,gid,sid,data){
    return exports.select(gid,3,sid).then(ret=>{
        if(!ret){
            return Promise.reject("server empty")
        }
        let url = `http://${ret['ip']}:${ret['port']}${api}`;
        let secret = arguments[4] || mvc.plugin.get('spirit.secret');
        if(secret) {
            mvc.library("sign/create", data,secret);
        }
        return library.post(url,data,true).then(ret=>mvc.library('promise/callback',ret))
    })
}

