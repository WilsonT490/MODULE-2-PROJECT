const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const phoneticEl = document.getElementById('phonetic');
const definitionsEl = document.getElementById('definitions');
const errorDiv = document.getElementById('error-message');

// Fetch word
async function fetchWord(word) {
  try {
    errorDiv.textContent = '';

    if (!word) {
      errorDiv.textContent = 'Please enter a word';
      return;
    }

    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!res.ok) {
      throw new Error('Word not found');
    }

    const data = await res.json();

    const result = data[0];

    // Display
    const wordEl = document.getElementById('word');
    phoneticEl.textContent = result.phonetic || '';

    definitionsEl.innerHTML = '';

    result.meanings.forEach(m => {
      m.definitions.forEach(d => {
        const p = document.createElement('p');
        p.textContent = `${m.partOfSpeech}: ${d.definition}`;
        definitionsEl.appendChild(p);
      });
    });

  } catch (err) {
    errorDiv.textContent = err.message;
  }
}

// Event
form.addEventListener('submit', (e) => {
  e.preventDefault();
  fetchWord(input.value.trim());
});
phonetics: [
  {
    "audio": "https://something.mp3"
  }
]