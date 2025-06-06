import { fetchListUserGameHistory$, postUserGameHistory$, updatedScoreGamePlay$ } from "../../controllers/userGameHistory.js";

const leaderboardBody = document.getElementById('leaderboard-body');
const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
const levelRanking = localStorage.getItem('gameDifficulty');
const computerId = localStorage.getItem('computerId');
const avatarUser = localStorage.getItem('avatar');

if (leaderboard.length > 0) {
    leaderboardBody.innerHTML = ''; // Xóa thông báo "Chưa có dữ liệu"
    leaderboard.sort((a, b) => b.score - a.score); // Sắp xếp theo điểm giảm dần
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

    const topUser = leaderboard[0];
    const updatedTopUser = {
        name: topUser.name,
        score: topUser.score,
        rankingLevel: levelRanking,
        avatar: avatarUser
    }
    if (!computerId) {
        try {
            const createdUser = await postUserGameHistory$(updatedTopUser);
            localStorage.setItem('computerId', createdUser.id);
            await fetchListUserGameHistory$();
        } catch (error) {
            console.log("POST highest user score get error");
        }
    } else {
        try {
            await updatedScoreGamePlay$(computerId, updatedTopUser);
            await fetchListUserGameHistory$();
        } catch (error) {
            console.log("UPDATE highest user score get error");
        }
    }

    // Xử lý sự kiện nhấp vào dấu "..."
    document.querySelectorAll('.detail-link').forEach(link => {
        link.addEventListener('click', () => {
            const index = link.getAttribute('data-index');
            const entry = leaderboard[index];
            showDetailModal(entry, index);
        });
    });
}

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
