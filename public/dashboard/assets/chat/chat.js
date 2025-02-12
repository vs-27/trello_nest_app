const form = document.querySelector('.trello-chat-form');
const input = document.querySelector('.trello-chat-input');
const nameBlock = document.querySelector('.trello-chat-name');

const scrollToBottom = () => {
  setTimeout(() => {
    var objDiv = document.getElementsByClassName("trello-chat-messages")[0];
    objDiv.scrollTop = objDiv.scrollHeight;
  }, 50);
};

const appendMessage = (data, insertInBegin = false) => {
  const isCurrentUser = data.name === nameBlock.innerHTML.trim();
  const messageClass = isCurrentUser ? 'user-message' : '';
  const html = `<div class="trello-message ${messageClass}">${data.name}: ${data.content}</div>`;
  
  if (insertInBegin) {
    $('.trello-chat-messages').prepend(html);
  } else {
    $('.trello-chat-messages').append(html);
  }

  setTimeout(scrollToBottom, 50);
};

const fetchUser = async (userId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
      }
    });
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
    
    const data = await response.json();
    return data.name;
  } catch (error) {
    return 'Unknown User';
  }
};

const fetchMessages = async (boardId, userId) => {
  try {
    const response = await fetch(`http://localhost:3000/messages?boardId=${boardId}&userId=${userId}`);
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
    
    const data = await response.json();
    
    return data.message || [];
  } catch (error) {
    return [];
  }
};

const initWs = async (boardId, userId) => {
  const socket = io('http://localhost:3000/chat', {
    auth: { token: localStorage.getItem('jwt_token') }
  });
  
  const userName = await fetchUser(userId);
  
  nameBlock.innerHTML = `${userName}`;
  
  socket.emit('join_board', { boardId });
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (input.value.trim()) {
      socket.emit('chat_message', { content: input.value, boardId, name: userName });
      appendMessage({ name: userName, content: input.value });
      input.value = '';
    }
  });
  
  socket.on('chat_message', (data) => {
    appendMessage(data);
  });
};

$(document).ready(async () => {
  const boardId = 2; // TODO: Replace with the current board ID dynamically
  const userId = 10; // TODO: Replace with the current user ID dynamically
  
  
  await initWs(boardId, userId);

  const messages = await fetchMessages(boardId, userId);
  messages.reverse().forEach(msg => appendMessage(msg, true));
  
  setTimeout(scrollToBottom, 100);
});

$(document).ready(async () => {
  $('body').on('click', '.chat-toggle-btn', () => {
    $('#chat-modal').toggleClass('chat-display');
    if ($('#chat-modal').hasClass('chat-display')) {
      scrollToBottom();
    }
  })
});
