import { fetchListUserGameHistory$ } from "../../controllers/userGameHistory.js";

const listUserGameHistory = await fetchListUserGameHistory$();

const difficulty = localStorage.getItem('gameDifficulty') || 'normal';
const gameArea = document.getElementById('game-area');
const scoreValue = document.getElementById('score-value');
const restartButton = document.getElementById('restart');
const pauseButton = document.getElementById('pause');
const endBtn = document.getElementById('endBtn');
const timerDisplay = document.getElementById('time-left');
let score = 0;
let isPaused = false;
let primeCount = 0; // Biến theo dõi số lượng số nguyên tố
let timeLeft = 60;
let countdownInterval;
let primesSelected = []; // Mảng lưu số nguyên tố đã chọn
let nonPrimesSelected = []; // Mảng lưu số không nguyên tố đã chọn
let totalNumbers = 10; // Số lượng số mặc định (sẽ được cập nhật theo cấp độ)

function startCountdown() {
    timeLeft = 60; // Thời gian 60 giây cho mọi cấp độ
    timerDisplay.textContent = timeLeft;
    clearInterval(countdownInterval); // Đảm bảo không bị lặp
    countdownInterval = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                handleEndGame(); // Hết giờ → kết thúc game
            }
        }
    }, 1000);
}

// Hàm kiểm tra số nguyên tố
function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

// Hàm tạo số ngẫu nhiên theo phạm vi cấp độ
function getRandomNumber() {
    let maxRange;
    switch (difficulty) {
        case 'easy':
            maxRange = 100;
            break;
        case 'normal':
            maxRange = 150;
            break;
        case 'hard':
            maxRange = 250;
            break;
        default:
            maxRange = 100;
    }
    return Math.floor(Math.random() * (maxRange + 1));
}

// Hàm kiểm tra chồng lấn
function isOverlapping(x, y, existingNumbers) {
    const newRect = { x, y, width: 60, height: 40 }; // Kích thước số mới
    for (const num of existingNumbers) {
        const rect = num.getBoundingClientRect();
        const gameAreaRect = gameArea.getBoundingClientRect();
        const existingRect = {
            x: rect.left - gameAreaRect.left,
            y: rect.top - gameAreaRect.top,
            width: rect.width,
            height: rect.height
        };
        if (
            x < existingRect.x + existingRect.width &&
            x + newRect.width > existingRect.x &&
            y < existingRect.y + existingRect.height &&
            y + newRect.height > existingRect.y
        ) {
            return true;
        }
    }
    return false;
}

// Hàm tạo vị trí ngẫu nhiên không chồng lấn
function getRandomPosition() {
    const maxX = gameArea.clientWidth - 60; // Trừ chiều rộng của số
    const maxY = gameArea.clientHeight - 40; // Trừ chiều cao của số
    const existingNumbers = gameArea.querySelectorAll('.number');
    let x, y;
    let attempts = 0;
    const maxAttempts = 50; // Giới hạn số lần thử

    do {
        x = Math.random() * maxX;
        y = Math.random() * maxY;
        attempts++;
        if (attempts >= maxAttempts) {
            return { x, y }; // Trả về vị trí ngẫu nhiên nếu không tìm được
        }
    } while (isOverlapping(x, y, existingNumbers));

    return { x, y };
}

// Hàm xóa tất cả số
function clearNumbers() {
    while (gameArea.firstChild) {
        gameArea.removeChild(gameArea.firstChild);
    }
    primeCount = 0; // Reset số lượng số nguyên tố
}

// Hàm kiểm tra xem tất cả số có phải không nguyên tố
function allNonPrime() {
    const numbers = gameArea.querySelectorAll('.number');
    return Array.from(numbers).every(number => !isPrime(Number(number.textContent)));
}

// Hàm tạo và hiển thị số
function createNumber(isPrimeNumber = false) {
    const number = document.createElement('div');
    number.classList.add('number');
    const value = isPrimeNumber ? getRandomPrime() : getRandomNonPrime();
    number.textContent = value;
    const pos = getRandomPosition();
    number.style.left = `${pos.x}px`;
    number.style.top = `${pos.y}px`;

    // Tăng biến đếm nếu là số nguyên tố
    if (isPrime(value)) {
        primeCount++;
    }

    // Xử lý sự kiện click
    number.addEventListener('click', () => {
        if (isPaused) return; // Không cho click khi tạm dừng
        if (isPrime(value)) {
            score += 15; // Cộng 15 điểm nếu là số nguyên tố
            primeCount--; // Giảm số lượng số nguyên tố
            primesSelected.push(value); // Lưu số nguyên tố đã chọn
        } else {
            score -= 5; // Trừ 5 điểm nếu không phải số nguyên tố
            nonPrimesSelected.push(value); // Lưu số không nguyên tố đã chọn
        }
        scoreValue.textContent = score;
        number.remove();
        // Tạo số mới ngay sau khi nhấp
        if (primeCount === 0 && allNonPrime()) {
            generateNewNumbers(); // Tạo lại số mới nếu không còn số nguyên tố
        } else {
            createNumber(); // Tạo một số mới để duy trì số lượng
        }
    });

    gameArea.appendChild(number);
}

// Hàm lấy số nguyên tố ngẫu nhiên trong phạm vi
function getRandomPrime() {
    let maxRange;
    switch (difficulty) {
        case 'easy':
            maxRange = 100;
            break;
        case 'normal':
            maxRange = 150;
            break;
        case 'hard':
            maxRange = 250;
            break;
        default:
            maxRange = 100;
    }
    const primes = [];
    for (let i = 2; i <= maxRange; i++) {
        if (isPrime(i)) primes.push(i);
    }
    return primes[Math.floor(Math.random() * primes.length)];
}

// Hàm lấy số không nguyên tố ngẫu nhiên
function getRandomNonPrime() {
    let num;
    do {
        num = getRandomNumber();
    } while (isPrime(num));
    return num;
}

// Hàm tạo số mới theo cấp độ
function generateNewNumbers() {
    clearNumbers();
    let primeCountNew, numberCount;
    switch (difficulty) {
        case 'easy':
            numberCount = 10;
            primeCountNew = Math.floor(Math.random() * 11); // 0–10
            break;
        case 'normal':
            numberCount = 15;
            primeCountNew = Math.floor(Math.random() * 6); // 0–5
            break;
        case 'hard':
            numberCount = 20;
            primeCountNew = Math.floor(Math.random() * 4); // 0–3
            break;
        default:
            numberCount = 10;
            primeCountNew = Math.floor(Math.random() * 11);
    }
    totalNumbers = numberCount; // Cập nhật số lượng số cần duy trì
    const primeIndices = [];
    while (primeIndices.length < primeCountNew) {
        const index = Math.floor(Math.random() * numberCount);
        if (!primeIndices.includes(index)) {
            primeIndices.push(index);
        }
    }

    for (let i = 0; i < numberCount; i++) {
        createNumber(primeIndices.includes(i));
    }
}

// Hàm khởi tạo trò chơi
function initializeGame() {
    clearNumbers();
    score = 0;
    scoreValue.textContent = score;
    isPaused = false;
    pauseButton.textContent = 'Dừng';
    primesSelected = []; // Reset danh sách số nguyên tố
    nonPrimesSelected = []; // Reset danh sách số không nguyên tố
    generateNewNumbers();
    startCountdown();
}

// Xử lý kết thúc game
async function handleEndGame() {
    clearInterval(countdownInterval);
    clearNumbers();

    const currentScore = parseInt(document.getElementById('score-value').textContent);
    const username = localStorage.getItem('quizName') || 'Ẩn danh';

    // Lưu vào localStorage cục bộ
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboard.push({
        name: username,
        score: currentScore,
        primes: primesSelected,
        nonPrimes: nonPrimesSelected
    });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    localStorage.setItem('quizScore', currentScore);

    // Chuyển trang 
    window.location.href = '/src/pages/PlayHistory/playHistory.html';
}

// Xử lý nút Chơi lại
restartButton.addEventListener('click', () => {
    initializeGame();
});

// Xử lý nút Dừng/tiếp tục
pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Tiếp tục' : 'Dừng';
});

// Xử lý nút Kết thúc
endBtn.addEventListener('click', handleEndGame);

// Khởi tạo trò chơi lần đầu
initializeGame();