const form = document.getElementById("search-form");
const input = document.getElementById("search");
const results = document.getElementById("results");
const error = document.getElementById("error");
const audio = document.getElementById("audio");

const addFavBtn = document.getElementById("add-fav");
const showFavBtn = document.getElementById("show-favorites");
const favList = document.getElementById("fav-list");

let currentWord = "";





// ------Fetch word-------
form.addEventListener("submit", async (e) => {
e.preventDefault();

const word = input.value.trim();
if (!word) return;

currentWord = word;
results.innerHTML = "Loading...";
error.classList.add("hidden");

try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await res.json();

    if (!res.ok) throw new Error("Word not found");

    displayResult(data[0]);
} catch (err) {
    results.innerHTML = "";
    error.textContent = err.message;
    error.classList.remove("hidden");
}

});





// -------Display result-------
function displayResult(data) {
const meaning = data.meanings[0].definitions[0].definition;
const phonetic = data.phonetic || "";

results.innerHTML = `
    <h2>${data.word}</h2>
    <p><strong>Phonetic:</strong> ${phonetic}</p>
    <p><strong>Meaning:</strong> ${meaning}</p>
    <button id="play-audio">🔊 Play Audio</button>
`;





// -------Audio-------
const audioSrc = data.phonetics.find(p => p.audio)?.audio;
if (audioSrc) {
    audio.src = audioSrc;

    document.getElementById("play-audio").onclick = () => {
        audio.play();
    };
}

}





// -------Add to favorites-------
addFavBtn.addEventListener("click", () => {
if (!currentWord) return;

let favs = JSON.parse(localStorage.getItem("favorites")) || [];

if (!favs.includes(currentWord)) {
    favs.push(currentWord);
    localStorage.setItem("favorites", JSON.stringify(favs));
    alert("Added to favorites!");
}

});






// -------Show favorites-------
showFavBtn.addEventListener("click", () => {
favList.innerHTML = "";

let favs = JSON.parse(localStorage.getItem("favorites")) || [];

favs.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    favList.appendChild(li);
});

});