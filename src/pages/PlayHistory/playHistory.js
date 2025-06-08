import { fetchListUserGameHistory$, postUserGameHistory$, updatedScoreGamePlay$ } from "../../controllers/userGameHistory.js";

async function syncLeaderboard() {
  const listUserGamePlay = await fetchListUserGameHistory$();

  const leaderboardBody = document.getElementById('leaderboard-body');
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  const levelRanking = localStorage.getItem('gameDifficulty');
  const uploadIds = JSON.parse(localStorage.getItem('uploadIds') || '{}');
  const computerId = uploadIds[levelRanking];
  const quizScoreLocal = localStorage.getItem('quizScore');
  const avatarUser = localStorage.getItem('avatar');
  const deviceId = localStorage.getItem('visitorId');

  if (leaderboard.length === 0) {
    return;
  }

  leaderboardBody.innerHTML = '';
  leaderboard
    .sort((a, b) => b.score - a.score)
    .forEach((entry, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${entry.name}</td>
        <td>${entry.score}</td>
        <td><span class="detail-link" data-index="${index}">...</span></td>
      `;
      leaderboardBody.appendChild(row);
    });

  const topUser = leaderboard[0];
  const payload = {
    name: topUser.name,
    score: quizScoreLocal,
    rankingLevel: levelRanking,
    avatar: avatarUser,
    deviceId
  };
  console.log('Payload to sync:', payload);

  function hasRecordForThisDeviceAndMode() {
    return listUserGamePlay.some(u =>
      u.deviceId === deviceId &&
      u.rankingLevel === levelRanking
    );
  }

  if (!computerId) {
    try {
      const created = await postUserGameHistory$(payload);
      uploadIds[levelRanking] = created.id;
      localStorage.setItem('uploadIds', JSON.stringify(uploadIds));
      console.log(`Created new record [${levelRanking}] id=${created.id}`);
    } catch (err) {
      console.error('Error POST new record:', err);
    }
  }
  else if (!hasRecordForThisDeviceAndMode()) {
    try {
      const created = await postUserGameHistory$(payload);
      uploadIds[levelRanking] = created.id;
      localStorage.setItem('uploadIds', JSON.stringify(uploadIds));
      console.log(`Created new record for this mode [${levelRanking}] id=${created.id}`);
    } catch (err) {
      console.error('Error POST missing record:', err);
    }
  }
  else {
    const existing = listUserGamePlay.find(u =>
      u.deviceId === deviceId &&
      u.rankingLevel === levelRanking
    );
    if (topUser.score > existing.score) {
      try {
        await updatedScoreGamePlay$(existing.id, payload);
        console.log(`Updated record id=${existing.id} to score=${topUser.score}`);
      } catch (err) {
        console.error('Error PUT update record:', err);
      }
    } else {
      console.log('Score không thay đổi, không sync');
    }
  }

  // 7. Gắn event cho các nút “...”
  document.querySelectorAll('.detail-link').forEach(link => {
    link.addEventListener('click', () => {
      const index = parseInt(link.dataset.index, 10);
      const entry = leaderboard[index];
      showDetailModal(entry, index);
    });
  });
}

syncLeaderboard();


function showDetailModal(entry) {
  const modal = document.getElementById('detail-modal');
  document.getElementById('detail-name').textContent = `Người chơi: ${entry.name}`;
  document.getElementById('detail-primes').textContent = `Số nguyên tố đã chọn: ${entry.primes?.length > 0 ? entry.primes.join(', ') : 'Không có'}`;
  document.getElementById('detail-non-primes').textContent = `Số không nguyên tố đã chọn: ${entry.nonPrimes?.length > 0 ? entry.nonPrimes.join(', ') : 'Không có'}`;
  document.getElementById('detail-score-gain').textContent = `Điểm đạt được: ${entry.primes?.length * 15 || 0}`;
  document.getElementById('detail-score-loss').textContent = `Điểm bị trừ: ${entry.nonPrimes?.length * 5 || 0}`;
  document.getElementById('detail-total-score').textContent = `Tổng điểm: ${entry.score}`;
  modal.style.display = 'block';
}

window.closeModal = function closeModal() {
  document.getElementById('detail-modal').style.display = 'none';
}

window.clearLeaderboard = function clearLeaderboard() {
  if (confirm("Bạn có chắc muốn xóa bảng xếp hạng?")) {
    localStorage.removeItem('computerId');
    localStorage.removeItem('gameDifficulty');
    localStorage.removeItem('leaderboard');
    localStorage.removeItem('quizName');
    localStorage.removeItem('quizScore');
    localStorage.removeItem('avatar');
    location.reload();
  }
}
