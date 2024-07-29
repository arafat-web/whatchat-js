const socket = io();

const loginDiv = document.getElementById('login');
const chatDiv = document.getElementById('chat');
const usernameInput = document.getElementById('username');
const groupnameInput = document.getElementById('groupname');
const showGroupName = document.getElementById('showGroupName');
const joinButton = document.getElementById('join');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

joinButton.addEventListener('click', () => {
  const userName = usernameInput.value.trim();
  const groupName = groupnameInput.value.trim();

  if (!userName || !groupName) {
    return;
  }

  if (userName && groupName) {
    socket.emit('join group', { userName, groupName });
    loginDiv.style.display = 'none';
    chatDiv.style.display = 'flex';
    showGroupName.textContent = groupName;
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});
socket.on('join group', (msg) => displayNotification(msg));
socket.on('leave', (msg) => displayNotification(msg));


socket.on('chat message', (data) => {
  if (data && data.userName) {
    const myName = data.userName;
    const message = data.msg;
    const isMyMessage = data.userName === usernameInput.value;
    displayMessage(myName, message, isMyMessage);
  } else {
    console.error("Received data is not in the expected format:", data);
  }
});


function displayMessage(userName, userMsg, isMyMessage) {

  // Format the current time
  const date = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const formattedTime = formatter.format(date);

  // Create message elements
  const message = document.createElement('div');
  const messageItem = document.createElement('div');
  const top = document.createElement('div');
  const name = document.createElement('div');
  const time = document.createElement('div');
  const content = document.createElement('div');

  // Apply classes
  message.classList.add('message-bubble', isMyMessage ? 'my-message' : 'other-message');
  messageItem.classList.add('message-item');
  messageItem.classList.add(isMyMessage ? 'my-color' : 'other-color');
  top.classList.add('message-top');
  name.classList.add('message-name');
  time.classList.add('message-time');
  content.classList.add('message-content');

  // Set content
  name.textContent = userName;
  time.textContent = formattedTime;
  content.textContent = userMsg;

  // Append elements
  top.appendChild(name);
  top.appendChild(time);
  messageItem.appendChild(top);
  messageItem.appendChild(content);
  message.appendChild(messageItem);
  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
}


function displayNotification(notification) {
  const notificationElement = document.createElement('div');
  notificationElement.textContent = notification;
  notificationElement.classList.add('notification');
  messages.appendChild(notificationElement);
  messages.scrollTop = messages.scrollHeight;
}
