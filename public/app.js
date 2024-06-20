document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket('ws://localhost:3000');
    const messagesDiv = document.getElementById('messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    function displayMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.classList.add('message', sender === 'bot' ? 'bot-message' : 'user-message');
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function saveSessionData(type, data) {
        localStorage.setItem(type, JSON.stringify(data));
    }

    function getSessionData(type) {
        return JSON.parse(localStorage.getItem(type)) || [];
    }

    socket.addEventListener('open', () => {
        const currentOrder = getSessionData('currentOrder');
        const orderHistory = getSessionData('orderHistory');

        socket.send(JSON.stringify({ type: 'init', currentOrder, orderHistory }));
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        displayMessage(data.message, 'bot');
        if (data.currentOrder !== undefined) {
            saveSessionData('currentOrder', data.currentOrder);
        }
        if (data.orderHistory !== undefined) {
            saveSessionData('orderHistory', data.orderHistory);
        }
    });

    function handleUserInput(input) {
        displayMessage(input, 'user');
        socket.send(JSON.stringify({ type: 'userMessage', message: input }));
        userInput.value = '';
    }

    sendButton.addEventListener('click', () => {
        const input = userInput.value;
        if (input) {
            handleUserInput(input);
        }
    });

    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });
});



