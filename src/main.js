import {createPilgrimageCard} from './components/pilgrimageCard.js';
import {loadJSON} from './utils/loadJSON.js';

const app = document.querySelector('#app');
const pilgrimagesSection = document.querySelector('#pilgrimages');

if (!app || !pilgrimagesSection) {
    throw new Error('Required DOM elements not found');
}

const statusMessage = document.createElement('p');

statusMessage.className = 'status-message';
statusMessage.textContent = 'System status: LOADING';

app.prepend(statusMessage);

async function initialiseApp() {
    try{
        const dataUrl = new URL("./data/pilgrimages.json", import.meta.url);
        const pilgrimages = await loadJSON(dataUrl);
        const firstPilgrimage = pilgrimages[0];

        if (!firstPilgrimage) {
            throw new Error('No pilgrimages found in the data');
        }

        const pilgrimageCard = createPilgrimageCard(firstPilgrimage);

        pilgrimagesSection.appendChild(card);
        statusMessage.textContent = 'System status: online';
    } catch (error) {
        console.error('Error loading pilgrimages:', error);
        statusMessage.textContent = 'System status: ERROR'; 
    }

}

initialiseApp();