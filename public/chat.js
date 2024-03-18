const webSocket = new WebSocket('ws://localhost:3000');
let user = '';

function sendMessage(e) {
    e.preventDefault();
    let input = document.querySelector('#text');

    let message = {
        user: user,
        text: input.value,
        time: new Date().toLocaleString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }

    webSocket.send(JSON.stringify(message));
    input.value = '';
    input.focus();
    createNewMessageView(message, true);
}

webSocket.onmessage = function (e) {
    createNewMessageView(JSON.parse(e.data));
}

let form = document.querySelector('#form');
form.addEventListener('submit', sendMessage);

webSocket.onopen = function () {
    user = prompt('Enter UserName', 'User');
    let input = document.querySelector('#text');
    input.focus();
}

function createNewMessageView(message, isFromMe = false) {
    let div = document.createElement('div');
    div.classList.add('message');
    if (isFromMe) {
        div.classList.add('isfromme');
    }

    let userName = document.createElement('p');
    userName.classList.add('username');
    userName.textContent = message.user;

    let messageText = document.createElement('p');
    messageText.classList.add('messagetext');
    messageText.textContent = message.text;

    let time = document.createElement('p');
    time.classList.add('time');
    time.textContent = message.time;

    div.appendChild(userName);
    div.appendChild(messageText);
    div.appendChild(time);
    document.querySelector('#chat').appendChild(div);

    window.scrollTo(0, document.body.scrollHeight);
}