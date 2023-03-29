const express=require('express');
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const formatMessage=require('./utils/messages')

const app=express(); 
const server=http.createServer(app)  
const io=socketio(server);


const botName="chatAppBot"
// Set static folder
app.use(express.static(path.join(__dirname,'public')))

//Run when client connects

io.on('connection',socket=>{

    //Welcome current User
    socket.emit('message',formatMessage(botName,'Welcome to chatApp'))

    //User connects broadcast  
    socket.broadcast.emit('message',formatMessage(botName,'A user has joined the chat'))

    //User disconnects the broadcast
    socket.on('disconnect',()=>{
        io.emit('message',formatMessage(botName,'A user has left the chat'))
    })

    //listen for chat message
    socket.on('chatMessage',(msg)=>{
        io.emit('message',formatMessage("USER",msg))
    });
})

const PORT=3000||process.env.PORT;

server.listen(PORT,()=>{
    console.log("Server running on port :",PORT)
}) 
 