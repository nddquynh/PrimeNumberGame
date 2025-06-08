import {
  fetchListUserGameHistory$,
  postUserGameHistory$,
  updatedScoreGamePlay$
} from "../../controllers/userGameHistory.js";

const leaderboardBody = document.getElementById('leaderboard-body');
const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');

// 🎯 Hiển thị bảng xếp hạng
if (leaderboard.length > 0) {
  leaderboardBody.innerHTML = '';
  leaderboard.sort((a, b) => b.score - a.score);

  leaderboard.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.name}</td>
      <td>${entry.score}</td>
      <td><span class="detail-link" data-index="${index}">...</span></td>
    `;
    leaderboardBody.appendChild(row);
  });

  document.querySelectorAll('.detail-link').forEach(link => {
    link.addEventListener('click', () => {
      const index = link.getAttribute('data-index');
      const entry = leaderboard[index];
      showDetailModal(entry);
    });
  });
}

// ✅ ĐỒNG BỘ API – Bọc trong async
async function syncTopPlayersByMode() {
  const uploadStatus = JSON.parse(localStorage.getItem('rankingUploadStatus') || '{}');
  const modes = ['easy', 'normal', 'hard'];

  for (const mode of modes) {
    const filtered = leaderboard.filter(entry => entry.rankingLevel === mode);
    if (filtered.length === 0) continue;

    filtered.sort((a, b) => b.score - a.score);
    const topUser = filtered[0];

    const payload = {
      name: topUser.name,
      score: topUser.score,
      rankingLevel: mode,
      avatar: topUser.avatar
    };

    try {
      if (!uploadStatus[mode]) {
        const created = await postUserGameHistory$(payload);
        uploadStatus[mode] = {
          id: created.id,
          score: created.score
        };
      } else if (topUser.score > uploadStatus[mode].score) {
        await updatedScoreGamePlay$(uploadStatus[mode].id, payload);
        uploadStatus[mode].score = topUser.score;
      }
    } catch (error) {
      console.error(`Lỗi khi đồng bộ chế độ [${mode}]:`, error);
    }
  }

  localStorage.setItem('rankingUploadStatus', JSON.stringify(uploadStatus));
}

syncTopPlayersByMode(); // 👉 GỌI NGAY SAU KHI ĐỊNH NGHĨA

// ✅ Modal chi tiết
function showDetailModal(entry) {
  const modal = document.getElementById('detail-modal');
  document.getElementById('detail-name').textContent = `Người chơi: ${entry.name}`;
  document.getElementById('detail-primes').textContent = `Số nguyên tố đã chọn: ${entry.primes?.length ? entry.primes.join(', ') : 'Không có'}`;
  document.getElementById('detail-non-primes').textContent = `Số không nguyên tố đã chọn: ${entry.nonPrimes?.length ? entry.nonPrimes.join(', ') : 'Không có'}`;
  document.getElementById('detail-score-gain').textContent = `Điểm đạt được: ${entry.primes?.length * 15 || 0}`;
  document.getElementById('detail-score-loss').textContent = `Điểm bị trừ: ${entry.nonPrimes?.length * 5 || 0}`;
  document.getElementById('detail-total-score').textContent = `Tổng điểm: ${entry.score}`;
  modal.style.display = 'block';
}

window.closeModal = () => {
  document.getElementById('detail-modal').style.display = 'none';
};

window.clearLeaderboard = () => {
  if (confirm("Bạn có chắc muốn xóa bảng xếp hạng?")) {
    localStorage.removeItem('leaderboard');
    localStorage.removeItem('rankingUploadStatus');
    localStorage.removeItem('quizName');
    localStorage.removeItem('quizScore');
    localStorage.removeItem('avatar');
    localStorage.removeItem('gameDifficulty');
    location.reload();
  }
};
