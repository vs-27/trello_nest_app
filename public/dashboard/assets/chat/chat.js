const socket = io('http://localhost:3000/chat');
const form = document.querySelector('.trello-chat-form');
const input = document.querySelector('.trello-chat-input');
const nameBlock = document.querySelector('.trello-chat-name');

const userName = prompt('Your name:');
nameBlock.innerHTML = `${userName}`;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (input.value) {
    socket.emit('chat_message', {message: input.value, name: userName});
    input.value = ''
  }
});

socket.on('chat_message', (data) => {
  $('.trello-chat-messages').append(`<div class="trello-message">${data.name}:  ${data.message}</div>`);
});
