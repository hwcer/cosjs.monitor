//ts:1-游戏，2-战斗，，，9-后台
const library = require('cosjs.library');
const server_rooms = new Map();

module.exports = function(setting){
    let options = Object.assign({"pingTimeout":5000,"pingInterval":1000,"serveClient":false},arguments[1]||{});
    let io = require('socket.io')(setting['port'],options);
    for(let ns of setting['namespace']){
        io.of(ns).on('connection',socket=>{
            let query = socket.handshake.query;
            if( query && query['secret'] === setting['secret'] ){
                connection(io,ns,socket)
            }
            else {
                socket.disconnect(true);
            }
        });
    }
    return io;
}


function connection(io,ns,socket){
    let query = socket.handshake.query;
    let update = JSON.tryParse(query.update);
    if(!update){
        socket.send('error','update error',query.update);
        socket.disconnect(true);
        return false;
    }
    update['ip'] = update['ip'] || socket.handshake.address.replace('::ffff:','');
    let id = update['id'] =String(library('iptable/encode',update['ip'],update['port'] ));
    socket.emit('update',Array.from(server_rooms));
    socket.spirit = id;
    server_rooms.set(id,update);
    io.of(ns).emit('online',id,update);
    socket.on("loadavg",(avg)=>{
        update['avg'] = avg;
        io.of(ns).emit('loadavg',id,avg);
    })
    socket.on('disconnect', () => {
        if(socket.spirit){
            server_rooms.delete(id);
            io.of(ns).emit('offline',id);
        }
    })
    //广播转发broadcast,arg1,arg2...
    socket.on("broadcast",function(){
        io.of(ns).emit('broadcast',...arguments);
    })
    //并发补救
    socket.on("refresh",(id)=>{
        let d = server_rooms.get(id);
        if(d){
            socket.emit('refresh',id,d);
        }
    })
}