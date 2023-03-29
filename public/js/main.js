const chatForm=document.getElementById('chat-form')
const chatMessage=document.querySelector('.chat-messages')

const socket= io()

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
      <p class="meta">Mary <span>9:15pm</span></p>
      <p class="text">
         ${message}
      </p>
 `
 document.querySelector('.chat-messages').appendChild(div);
}