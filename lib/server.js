//ts:1-游戏，2-战斗，，，9-后台
const library = require('cosjs.library');
module.exports = function(setting){
    let options = Object.assign({"pingTimeout":5000,"pingInterval":1000,"serveClient":false},arguments[1]);
    let io = require('socket.io')(setting['port'],options);
    io.PUBGROUP = arguments[2]||'_Public_Group';
    io.on('connection',function(socket) {
        let query = socket.handshake.query;
        if( query && query['secret'] === setting['secret'] ){
            connection.call(io,socket)
        }
        else {
            socket.disconnect(true);
        }
    })
}


function connection(socket){
    let io = this;
    let query = socket.handshake.query;
    let update = JSON.tryParse(query.update);
    if(!update){
        socket.send('error','update error',query.update);
        socket.disconnect(true);
        return false;
    }
    update['ip'] = update['ip'] || socket.handshake.address.replace('::ffff:','');
    update['id'] = String(library('iptable/encode',update['ip'],update['port'] ));
    update['gid'] = update['gid'] || io.PUBGROUP;
    update['ispub'] = update['gid'] == io.PUBGROUP ? 1 : 0;
    socket.sid = update['id'];
    socket.gid = update['gid'];
    socket.join(socket.gid, () => {
        broadcast.call(io,socket, 'online', update);
    });

    //this.dataset.set(socket.sid,update);
    socket.on("loadavg",(avg)=>{
        update['avg'] = avg;
        broadcast.call(io,socket,'loadavg',update);
    })
    socket.on('disconnect', () => {
        if(socket.sid){
            broadcast.call(io,socket,'offline',Date.now());
        }
    })
    //广播转发broadcast,arg1,arg2...
    socket.on("broadcast",function(){
        broadcast.call(io,socket,'broadcast',...arguments);
    })
}

function broadcast(socket,name,data){
    let io = this,sid=socket.sid;
    if(socket.gid == io.PUBGROUP){
        return io.sockets.emit(name,sid,data);
    }
    socket.to(io.PUBGROUP).to(socket.gid).emit(name,sid,data);
    if(name !== 'offline'){
        socket.emit(name,sid,data);
    }
}