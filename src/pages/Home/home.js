const track = document.getElementById("sliderTrack");
let index = 0;
const totalSlides = track.children.length;

function updateSlider() {
    track.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
    index = (index + 1) % totalSlides;
    updateSlider();
}

function prevSlide() {
    index = (index - 1 + totalSlides) % totalSlides;
    updateSlider();
}

function goToNamePage() {
    const level = document.getElementById('difficulty').value;
    localStorage.setItem('gameDifficulty', level);
    window.location.href = 'Index.html';
}

function startGame() {
    window.location.href = "../Login/login.html"
}

function viewRanking() {
    window.location.href = '../Ranking/ranking.html';
}