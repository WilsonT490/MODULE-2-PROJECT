// Select elements
const form = document.getElementById('search-form');
const input = document.getElementById('word-input');
const errorDiv = document.getElementById('error');

const wordEl = document.getElementById('word');
const phoneticEl = document.getElementById('phonetic');
const audioEl = document.getElementById('audio');
const definitionsEl = document.getElementById('definitions');
const synonymsEl = document.getElementById('synonyms');

// Fetch word data
async function fetchWord(word) {
  try {
    clearUI();

    if (!word) {
      throw new Error('Please enter a word');
    }

    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    if (!response.ok) {
      throw new Error('Word not found');
    }

    const data = await response.json();

    displayWord(data[0]);

  } catch (error) {
    displayError(error.message);
  }
}

// Display word data
function displayWord(data) {
  wordEl.textContent = data.word;

  phoneticEl.textContent = data.phonetic || 'No pronunciation available';

  // Audio handling
  const audioSource = data.phonetics.find(p => p.audio)?.audio;

  if (audioSource) {
    audioEl.src = audioSource;
    audioEl.classList.remove('hidden');
  } else {
    audioEl.classList.add('hidden');
  }

  // Definitions
  definitionsEl.innerHTML = '<h3>Definitions:</h3>';

  data.meanings.forEach(meaning => {
    meaning.definitions.forEach(def => {
      const p = document.createElement('p');
      p.textContent = `${meaning.partOfSpeech}: ${def.definition}`;
      definitionsEl.appendChild(p);
    });
  });

  // Synonyms
  synonymsEl.innerHTML = '<h3>Synonyms:</h3>';

  let synonyms = [];

  data.meanings.forEach(m => {
    synonyms = synonyms.concat(m.synonyms);
  });

  if (synonyms.length === 0) {
    synonymsEl.innerHTML += '<p>No synonyms available</p>';
  } else {
    synonyms.forEach(syn => {
      const span = document.createElement('span');
      span.textContent = syn;
      span.classList.add('synonym');

      // Click synonym to search again
      span.addEventListener('click', () => fetchWord(syn));

      synonymsEl.appendChild(span);
    });
  }

  // Hide error if successful
  errorDiv.classList.add('hidden');
}

// Show error
function displayError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
}

// Clear UI
function clearUI() {
  errorDiv.textContent = '';
  errorDiv.classList.add('hidden');

  wordEl.textContent = '';
  phoneticEl.textContent = '';
  definitionsEl.innerHTML = '';
  synonymsEl.innerHTML = '';
  audioEl.classList.add('hidden');
}

// Form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  fetchWord(input.value.trim());
});