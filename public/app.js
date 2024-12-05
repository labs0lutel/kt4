async function fetchData(endpoint) {
    try {
        const url = `https://jsonplaceholder.typicode.com/${endpoint}`;
        console.log('Запрос к URL:', url); 

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }
        const data = await response.json();
        console.log('Данные получены:', data); 
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
    if (data && data.length) {
        data.forEach(item => {
            const div = document.createElement('div');
            div.textContent = JSON.stringify(item, null, 2); 
            container.appendChild(div);
        });
    } else {
        container.textContent = 'Нет данных для отображения.';
    }
}

document.querySelector('#loadDataButton').addEventListener('click', async () => {
    const endpoint = document.querySelector('#dataTypeSelect').value; 
    const data = await fetchData(endpoint);
    if (data) {
        renderData(data);
    }
});

const socket = io('https://kt4.onrender.com');

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

const eventSource = new EventSource('https://kt4.onrender.com/updates'); 

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
