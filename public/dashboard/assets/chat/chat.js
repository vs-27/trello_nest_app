const form = document.querySelector('.trello-chat-form');
const input = document.querySelector('.trello-chat-input');
const nameBlock = document.querySelector('.trello-chat-name');

const socket = io('http://localhost:3000/chat', {
  auth: { token: localStorage.getItem('jwt_token') }
});

const userName = prompt('Your name:');
const boardId = 2;
nameBlock.innerHTML = `${userName}`;

socket.emit('join_board', { boardId });

const token = localStorage.getItem('token');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (input.value) {
    socket.emit('chat_message', { content: input.value, boardId });//todo: replace boardId by current page board id
    input.value = ''
  }
});

socket.on('chat_message', (data) => {
  $('.trello-chat-messages').append(`<div class="trello-message">${data.name}:  ${data.message}</div>`);
});
