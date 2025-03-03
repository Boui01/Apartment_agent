 // server/index.js
 const express = require('express');
 const http = require('http');
 const { Server } = require('socket.io');
 const cors = require('cors');

 let Max_chatRoom = 10
 const toDay = new Date();
 const rooms = [];
 const history = []
 const active = [];
 const app = express();
 const server = http.createServer(app);

 // Enable CORS
 app.use(cors());


 const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Replace with your client's origin
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
    },
 });

 io.on('connection', (socket) => {
    console.log('a user connected');

    let chatRoom = 0;

    /// delted storage
    history.forEach( (item,index) => {
        const check = item.time.getDay() == toDay.getDay() ? item.time.getHours() >= toDay.getHours()-1 : false

        if(!check){
            const check_rooms = rooms.findIndex( (room) => room.id_room == item.id_room)
            if(check_rooms > -1){
                rooms.splice( check_rooms ,1)
            }

            history.splice(index,1)
        }
        console.log('Time : ',check , history);
        
    });

    /*                                                          Active-Message                                                                */
    socket.on('active-message', (msg) => {
        console.log('active-message: ' , msg);
        io.emit('active-message', {
            id : msg,
        });
    });


    /*                                                          Request-Message                                                                */

    socket.on('request-message', (msg) => {
        const check_request = {     check_user : rooms.map( user => user.user_request).findIndex( (user) => user.id == msg.id) ,
                                    check_admin: rooms.map( user => user.user_response).findIndex( (user) => user.id == msg.id) 
                              } 
        if(check_request.check_user == -1 && msg.status == 'user' ){
            rooms.push({
                id_room : 0,
                user_request : {                
                    id_room : 0,
                    response: msg.response,
                    status: msg.status,
                    id : msg.id,
                    fname: msg.fname,
                    lname: msg.lname,
                    image: msg.image
                },
                user_response : ''
            })
            console.log('check - request : ' ,check_request, rooms , rooms[check_request]);
            // send request          
            console.log('request-message: ' , msg);
            io.emit('request-message', {
                id_room : msg.id_room,
                response: msg.response,
                status: msg.status,
                request: msg.request,
                id : msg.id,
                fname: msg.fname,
                lname: msg.lname,
                image: msg.image
            });
        }
        else if( check_request.check_user > -1 && rooms[check_request.check_user].id_room != 0){
            console.log('request-message: ' , msg);
            io.emit('request-message', {
                id_room : rooms[check_request.check_user].id_room,
                response: msg.response,
                status: msg.status,
                request: true,
                id : msg.id,
                fname: msg.fname,
                lname: msg.lname,
                image: msg.image
            });
        }
        else if( check_request.check_admin > -1 && rooms[check_request.check_admin].id_room != 0){
            console.log('request-message: ' , msg);
            io.emit('request-message', {
                id_room : rooms[check_request.check_admin].id_room,
                response: msg.response,
                status: msg.status,
                request: true,
                id : msg.id,
                fname: msg.fname,
                lname: msg.lname,
                image: msg.image
            });
        }
        else if(msg.status == 'user'){
            console.log('request-message: ' , msg);
                io.emit('request-message', {
                    id_room : 0,
                    response: msg.response,
                    status: msg.status,
                    request: false,
                    id : msg.id,
                    fname: msg.fname,
                    lname: msg.lname,
                    image: msg.image
                });
        }
            console.log('request-message-last: ' , check_request.check_user > -1 && rooms[check_request.check_user] ? rooms[check_request.check_user].id_room != 0 : false,
                                                    check_request.check_admin > -1 && rooms[check_request.check_admin] ? rooms[check_request.check_admin].id_room != 0 : false,
                        );


      });





    /*                                                          Message                                                                */  
    socket.on('message', (msg) => {
        const check = history.findIndex(item => (item.id_room == 0 && item.info == ''))
        if(check > -1){
            history.splice( check,1)// remove position
            history.push({
                id_room : msg.id_room,
                time : new Date(msg.time) , 
                info : {   
                            id_room : msg.id_room,
                            message: msg.message,
                            status: msg.status,
                            id : msg.id,
                            fname: msg.fname,
                            lname: msg.lname,
                            time : msg.time
                        }
            });
            console.log('check-chat : ' , check , history)
        }
        else{
            history.push({
                id_room : msg.id_room,
                time : new Date(msg.time) , 
                info : {   
                            id_room : msg.id_room,
                            message: msg.message,
                            status: msg.status,
                            id : msg.id,
                            fname: msg.fname,
                            lname: msg.lname,
                            time : msg.time
                        }
            });
            console.log('check-chat : ' , check , history)
        }

        console.log('message: ' + msg.message);
        io.emit('message', {
            id_room : msg.id_room,
            message: msg.message,
            status: msg.status,
            id : msg.id,
            fname: msg.fname,
            lname: msg.lname,
            time : msg.time
        });
    });






    /*                                                          Connect-Message                                                                */
    socket.on('connect-message', (msg) => {
        console.log('connect-message: ' + msg);

        /// create new room
        for (let i = 1; i <= Max_chatRoom; i++) {
            const check_room = rooms.findIndex(item => item.id_room == i);
            if(check_room == -1) {
                history.push({id_room : i, time : toDay , info : ''})
                chatRoom = i ;
                console.log('check-room : ' + check_room , chatRoom , rooms)
                break;
            }
        }

        const set_user_room = rooms.findIndex( room => room.id_room == 0 && room.user_request.id == msg.id_user_request)
        // create user in room 
        if(set_user_room > -1){
            rooms[set_user_room].id_room = chatRoom;
            rooms[set_user_room].user_request.id_room = chatRoom;
            rooms[set_user_room].user_response = {
                id_room : chatRoom,
                response: msg.response,
                status: msg.status,
                id : msg.id,
                fname: msg.fname,
                lname: msg.lname,
                image: msg.image
            }
        }
        console.log('check-room-user : ' , rooms)

        io.emit('connect-message', {
            id_room : chatRoom,
            user_request :  rooms[set_user_room].user_request,
            user_response :  rooms[set_user_room].user_response,
        });
    });


    
    
    
    
    /*                                                          Reconnect                                                               */
    socket.on('reconnect-message', (msg) => {
        const backup_chat_id_room = history.filter( item => item.id_room == msg.id_room)
        const backup_user_id_room = rooms.filter(room => room.user_request.id == msg.id || room.user_response.id == msg.id)[0] 
        console.log('reconnect-message: ' , backup_chat_id_room , backup_user_id_room);
        io.emit('reconnect-message', {
            id_room : backup_chat_id_room.map(item => item.id_room)[0],
            info : backup_chat_id_room.map(item=> item.info),
            user_request : backup_user_id_room.user_request,
            user_response : backup_user_id_room.user_response
            
        });
    });






    /*                                                          Disconnect                                                              */
    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('disconnect-message', {
            message: 'User disconnected',
        });
    });

});

 server.listen(3001, () => {
    console.log('listening on *:3001');
 });


