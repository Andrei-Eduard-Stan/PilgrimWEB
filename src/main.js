const app = document.querySelector('#app');

if (!app) {
    throw new Error('App element not found');
}

const statusMessage = document.createElement('p');

statusMessage.className = "system-status";
statusMessage.textContent = "system status: Online";

app.prepend(statusMessage);