const express=require('express');
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const formatMessage=require('./utils/messages')
const {userJoin,getCurrentUser,userLeave,getRoomUser}=require('./utils/user')

const app=express(); 
const server=http.createServer(app)  
const io=socketio(server);


const botName="chatAppBot"
// Set static folder
app.use(express.static(path.join(__dirname,'public')))

//Run when client connects

io.on('connection',socket=>{

    socket.on('joinRoom',({username,room})=>{

    const user=userJoin(socket.id,username,room)

    socket.join(user.room)

    //Welcome current User
    socket.emit('message',formatMessage(botName,'Welcome to chatApp'))

    //User connects broadcast  
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`))
  
    //Send user and room info
     io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUser(user.room)
     })

    })

    //listen for chat message
    socket.on('chatMessage',(msg)=>{

        const user=getCurrentUser(socket.id)

    io.to(user.room).emit('message',formatMessage(user.username,msg))
    });

     //User disconnects the broadcast
    socket.on('disconnect',()=>{
        const user=userLeave(socket.id)
        if(user){ 
        io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`))

        //Send user and room info
        io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUser(user.room)
     })


        }
    })

})



const PORT=3000||process.env.PORT;

server.listen(PORT,()=>{
    console.log("Server running on port :",PORT)
}) 
 