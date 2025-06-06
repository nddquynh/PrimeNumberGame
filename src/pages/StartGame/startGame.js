function goToNamePage() {
    const level = document.getElementById('difficulty').value;
    localStorage.setItem('gameDifficulty', level); // lưu cấp độ vào localStorage
    window.location.href = '../Login/login.html'; // tiếp tục đến trang nhập tên
}

function viewRanking() {
    window.location.href = '../Ranking/ranking.html';
}