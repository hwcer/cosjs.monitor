"use strict";

//必须和spirit同一进程才能使用
const local  = require('../lib/spirit');
//获取服务器列表
//ts: 1-游戏服，2-聊天服，3-战斗服,9-战斗服
exports.page = function() {
    let gid = this.get("gid",'string');
    return local.page(gid);
}


//选择服务器
exports.select = function() {
    let ts = this.get("ts",'int');
    let sid = this.get("sid",'int');
    let avg = this.get("avg",'int');
    let gid = this.get("gid",'string');
    return local.select(gid,ts,sid,avg);
}