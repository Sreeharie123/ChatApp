const chatForm=document.getElementById('chat-form')
const chatMessage=document.querySelector('.chat-messages')

//Get Username and discussing topic from URL
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})
const socket= io()
 
//join chatroom
socket.emit('joinRoom',{username,room})

//Message from server
socket.on('message',message=>{
    console.log(message)
    outputMessage(message)

    //Scroll down
    chatMessage.scrollTop=chatMessage.scrollHeight;
})


//Message submit
chatForm.addEventListener('submit',(e)=>{

    //prevent the default nature
    e.preventDefault()

    //Get the message text
    const msg=e.target.elements.msg.value

    //Emit message to server
    socket.emit('chatMessage',msg)

    //Clear input
    e.target.elements.msg.value=''
    e.target.elements.msg.focus();

}) 


//outputMessage to DOM

function outputMessage(message){


    const div=document.createElement('div');
    div.classList.add('message');
      div.innerHTML=`
      <p class="meta">${message.userName} :  <span>${message.time}</span></p>
      <p class="text">
         ${message.text}
      </p>
 `
 document.querySelector('.chat-messages').appendChild(div);
}