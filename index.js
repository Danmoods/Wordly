const form = document.getElementById('search-form');
const input = document.getElementById('search');
const result = document.getElementById('results');
const error = document.getElementById('error');
const audio = document.getElementById('audio');
const favList = document.getElementById('fav-list');

// let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// document.getElementById('show-favorites').addEventListener('click', () => {
//     favList.innerHTML = favorites.map(fav => `<li>${fav}</li>`).join('');
//     favList.classList.remove('hidden');
// });

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = input.value.trim();

    if (!searchTerm) return;

    fetchWord(searchTerm);
});

async function fetchWord(searchTerm) {
    error.classList.add('hidden');
    result.classList.add('hidden');

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`);

        if (!response.ok) {
            throw new Error('Word not found');
        }

        const data = await response.json();
        displayResult(data[0]);

    } catch (err) {
        showError(err.message);
    }
}

function displayResult(data) {
    const { word, phonetic, meanings } = data;
    const audioSrc = data.phonetics.find(p => p.audio)?.audio || '';

    result.innerHTML = `
        <h2>${word}</h2>
        <p>${phonetic || ''}</p>
        <button id="play-audio">🔊 Play Pronunciation</button>

        <div>
            ${meanings.map(m => `
                <div>
                    <h3>${m.partOfSpeech}</h3>
                    <ul>
                        ${m.definitions.map(d => `<li>${d.definition}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
    `;

    const playButton = document.getElementById('play-audio');

    playButton.addEventListener('click', () => {
        if (audioSrc) {
            audio.src = audioSrc;
            audio.play();
        } else {
            alert('Audio not available for this word.');
        }
    });

    result.classList.remove('hidden');
}






function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
}