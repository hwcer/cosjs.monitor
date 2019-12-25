"use strict";

const root = __dirname;
const name = "spirit";

const config = {
    "prefix":"",                //本地通信API前缀，gid,sid 自动替换成变量值
    "secret":"",                //本地通信秘钥
}

const plugin = {
    "handle":{
        "local":root+"/local.js",
    },
    "library":root+"/library.js",
}



module.exports = function(options){
    Object.assign(config,options);
    return {name,config,plugin};
}