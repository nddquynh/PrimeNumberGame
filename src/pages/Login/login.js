import { zodiacSVGs } from "../../model/avatarAnimal.js";
let selectedZodiac = 'Tý';

function generateZodiacGrid() {
  const zodiacGrid = document.getElementById('zodiac-grid');
  zodiacGrid.innerHTML = ''; // 🔧 xoá trước khi tạo lại

  Object.keys(zodiacSVGs).forEach(zodiac => {
    const div = document.createElement('div');
    div.className = 'zodiac-item';
    div.innerHTML = zodiacSVGs[zodiac];
    div.title = zodiac;

    if (zodiac === selectedZodiac) {
        div.classList.add('selected'); // ✅ Đánh dấu con chuột mặc định bị nhạt
    }

    div.onclick = () => {
    selectedZodiac = zodiac;

    // Bỏ lớp selected khỏi tất cả các avatar
    document.querySelectorAll('.zodiac-item').forEach(item => {
        item.classList.remove('selected');
    });

    // Thêm lớp selected vào avatar được chọn
    div.classList.add('selected');
};

    zodiacGrid.appendChild(div);
  });
}

window.startGame = function startGame() {
  const username = document.getElementById('username').value.trim();
  const difficulty = document.getElementById('difficulty').value;
  const errorMsg = document.getElementById('error-msg');
  if (username === '') {
    errorMsg.textContent = 'Vui lòng nhập tên!';
    return;
  }
  localStorage.setItem('quizName', username);
  localStorage.setItem('gameDifficulty', difficulty);
  localStorage.setItem('avatar', selectedZodiac);
  window.location.href = '/src/pages/Game/game.html';
}

window.updateAvatar = function updateAvatar() {
  const selected = document.getElementById('zodiac').value;
  const chat = document.getElementById('chat-bubble');
  const avatar = document.getElementById('avatar-svg');

  chat.textContent = `👋 Chào bạn, tôi là ${selected}`;
  avatar.innerHTML = zodiacSVGs[selected] || zodiacSVGs['Tý'];
  document.getElementById('color-grid').style.display = 'block';
}

window.openAvatarModal = function openAvatarModal() {
  document.getElementById('avatar-modal').style.display = 'flex';
}

window.applyAvatarSelection = function applyAvatarSelection() {
  document.getElementById('avatar-svg').innerHTML = zodiacSVGs[selectedZodiac];
  document.getElementById('chat-bubble').textContent = `👋 Chào bạn, tôi là ${selectedZodiac}`;
  document.getElementById('avatar-modal').style.display = 'none';
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('avatar-svg').innerHTML = zodiacSVGs['Tý'];
  document.getElementById('chat-bubble').textContent = '👋 Chào bạn, tôi là Tý';
  generateZodiacGrid();
});

console.log(zodiacSVGs);
