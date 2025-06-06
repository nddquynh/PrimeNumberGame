import { fetchListUserGameHistory$ } from "../../controllers/userGameHistory.js";
import { zodiacSVGs } from "../../model/avatarAnimal.js";

const listUserGamePlay = await fetchListUserGameHistory$();
console.log(listUserGamePlay);
displayTopUser();

async function displayTopUser() {
    const leaderboardBody = document.getElementById('leaderboard-body');
    if (listUserGamePlay.length > 0) {
        leaderboardBody.innerHTML = ''; // Xóa thông báo “Chưa có dữ liệu”

        listUserGamePlay.sort((a, b) => b.score - a.score);

        listUserGamePlay.forEach((users, index) => {
            const rowDOM = document.createElement('tr');

            const avatarCellDOM = document.createElement('td');
            avatarCellDOM.innerHTML = zodiacSVGs[users.avatar];
            avatarCellDOM.className = `avatar-dom`;

            const rankCellDOM = document.createElement('td');
            rankCellDOM.textContent = index + 1;

            const nameCellDOM = document.createElement('td');
            nameCellDOM.textContent = users.name;


            const scoreCell = document.createElement('td');
            scoreCell.textContent = users.score;

            rowDOM.appendChild(avatarCellDOM);
            rowDOM.appendChild(rankCellDOM);
            rowDOM.appendChild(nameCellDOM);
            rowDOM.appendChild(scoreCell);

            leaderboardBody.appendChild(rowDOM);
        });
    }
}