import { fetchListUserGameHistory$ } from "../../controllers/userGameHistory.js";
import { zodiacSVGs } from "../../model/avatarAnimal.js";

// Slider logic
const track = document.getElementById("sliderTrack");
let index = 0;
const totalSlides = track.children.length;

function updateSlider() {
  track.style.transform = `translateX(-${index * 100}%)`;
}

window.nextSlide = function () {
  index = (index + 1) % totalSlides;
  updateSlider();
};

window.prevSlide = function () {
  index = (index - 1 + totalSlides) % totalSlides;
  updateSlider();
};

// Gọi API và hiển thị bảng theo chế độ
const listUserGamePlay = await fetchListUserGameHistory$();
displayLeaderboard();

function renderRanking(users, containerId) {
  const container = document.getElementById(containerId);
  if (!users || users.length === 0) {
    container.innerHTML = `<tr><td colspan="4" class="no-data">Không có dữ liệu</td></tr>`;
    return;
  }

  users.sort((a, b) => b.score - a.score);
  container.innerHTML = "";

  users.forEach((user, i) => {
    const row = document.createElement("tr");

    const avatarCell = document.createElement("td");
    avatarCell.innerHTML = zodiacSVGs[user.avatar] || "❓";
    avatarCell.className = "avatar-dom";

    const rankCell = document.createElement("td");
    rankCell.textContent = i + 1;

    const nameCell = document.createElement("td");
    nameCell.textContent = user.name;

    const scoreCell = document.createElement("td");
    scoreCell.textContent = user.score;

    row.appendChild(avatarCell);
    row.appendChild(rankCell);
    row.appendChild(nameCell);
    row.appendChild(scoreCell);

    container.appendChild(row);
  });
}

function displayLeaderboard() {
  renderRanking(listUserGamePlay.filter(u => u.rankingLevel === "easy"), "easy-ranking");
  renderRanking(listUserGamePlay.filter(u => u.rankingLevel === "normal"), "normal-ranking");
  renderRanking(listUserGamePlay.filter(u => u.rankingLevel === "hard"), "hard-ranking");
}
