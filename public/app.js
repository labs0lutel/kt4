// Функционал Fetch API для работы с Fake API
async function fetchData(endpoint) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/${endpoint}`);
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        alert('Не удалось загрузить данные.');
        return null;
    }
}

function renderData(data) {
    const container = document.querySelector('#dataContainer');
    container.innerHTML = '';
    data.forEach(item => {
        const div = document.createElement('div');
        div.textContent = JSON.stringify(item, null, 2); 
        container.appendChild(div);
    });
}

document.querySelector('#loadDataButton').addEventListener('click', async () => {
    const endpoint = document.querySelector('#dataTypeSelect').value; 
    const data = await fetchData(endpoint);
    if (data) {
        renderData(data);
    }
});

const socket = io('http://localhost:3000');

document.querySelector('#chatForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const message = document.querySelector('#chatInput').value;
    socket.emit('chat message', message);
    document.querySelector('#chatInput').value = ''; 
});

socket.on('chat message', (msg) => {
    const messageList = document.querySelector('#messages');
    const li = document.createElement('li');
    li.textContent = msg;
    messageList.appendChild(li);
});

socket.on('connect_error', () => {
    alert('Ошибка WebSocket соединения. Проверьте сервер.');
});

const eventSource = new EventSource('http://localhost:3000/updates');

eventSource.onmessage = (event) => {
    const updates = document.querySelector('#updates');
    const div = document.createElement('div');
    div.textContent = event.data;
    updates.appendChild(div);
};

eventSource.onerror = () => {
    console.error('Ошибка подключения к SSE серверу');
    alert('Ошибка SSE соединения. Проверьте сервер.');
};
