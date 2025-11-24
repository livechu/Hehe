// --- Đăng nhập ---
const loginScreen = document.getElementById('loginScreen');
const robotScreen = document.getElementById('robotScreen');
const loginBtn = document.getElementById('loginBtn');
const keyInput = document.getElementById('keyInput');
const loginMsg = document.getElementById('loginMsg');

// Robot elements
const robotContainer = document.getElementById('robotContainer');
const timerEl = document.getElementById('timer');
const predictionEl = document.getElementById('prediction');
const boardEl = document.getElementById('board');
const totalCountEl = document.getElementById('totalCount');
const armLeft = document.getElementById('armLeft');
const armRight = document.getElementById('armRight');
const tipsText = document.getElementById('tipsText');
const lockTipsBtn = document.getElementById('lockTipsBtn');

// Trạng thái
let count = 0;
const maxCount = 20;
const countdownMax = 30;
let countdown = countdownMax;
let timerInterval = null;
let roundRunning = false;

// Tài xỉu options
const options = ['TÀI', 'XỈU'];

// Độ chính xác ~85%
const accuracy = 0.85;

// Mở khóa mẹo chơi
let tipsLocked = true;

// Tạo tuyết rơi
function createSnow() {
  const snowContainer = document.getElementById('snow');
  if(!snowContainer) return;
  const flakesCount = 80;
  for(let i=0; i<flakesCount; i++) {
    const flake = document.createElement('div');
    flake.classList.add('flake');
    const size = Math.random() * 4 + 2;
    flake.style.width = size + 'px';
    flake.style.height = size + 'px';
    // left dùng vw: random 0..100
    flake.style.left = (Math.random() * 100) + 'vw';
    flake.style.animationDuration = (5 + Math.random()*10) + 's';
    flake.style.animationDelay = (Math.random()*15) + 's';
    snowContainer.appendChild(flake);
  }
}
createSnow();

// Kiểm tra key đăng nhập
loginBtn.onclick = () => {
  const key = keyInput.value.trim();
  if(key === '111') {
    loginMsg.textContent = '';
    loginScreen.style.display = 'none';
    robotScreen.style.display = 'block';
    startRound();
  } else {
    loginMsg.textContent = 'Key sai, vui lòng nhập lại!';
    keyInput.value = '';
  }
};

// Chạy 1 vòng chơi
function startRound() {
  if(roundRunning) return;
  if(count >= maxCount) {
    predictionEl.textContent = 'Đã chơi đủ 20 lượt.';
    return;
  }
  roundRunning = true;
  countdown = countdownMax;
  timerEl.textContent = countdown;
  boardEl.textContent = '---';
  predictionEl.textContent = 'Đoán: ---';
  predictionEl.className = '';
  armLeft.style.transform = 'rotate(0deg)';
  armRight.style.transform = 'rotate(0deg)';

  // Đếm ngược
  timerInterval = setInterval(() => {
    countdown--;
    timerEl.textContent = countdown;
    if(countdown <= 0) {
      clearInterval(timerInterval);
      showResult();
    }
  }, 1000);
}

// Sinh kết quả thật ngẫu nhiên
function getRealResult() {
  return options[Math.floor(Math.random() * options.length)];
}

// Robot đoán với độ chính xác ~85%
function getRobotGuess(real) {
  if(Math.random() < accuracy) {
    return real; // đoán đúng
  } else {
    return real === 'TÀI' ? 'XỈU' : 'TÀI'; // đoán sai
  }
}

// Hiển thị kết quả
function showResult() {
  if(count >= maxCount) return;
  const realResult = getRealResult();
  const guess = getRobotGuess(realResult);
  const isCorrect = guess === realResult;

  boardEl.textContent = realResult;
  predictionEl.textContent = `Đoán: ${guess} ${isCorrect ? '✅' : '❌'}`;
  predictionEl.className = guess === 'TÀI' ? 'tai' : 'xiu';

  // Tay robot chỉ lên bảng khi ra kết quả
  if (guess === 'TÀI') {
    armLeft.style.transform = 'rotate(20deg)';
    armRight.style.transform = 'rotate(-10deg)';
  } else {
    armLeft.style.transform = 'rotate(-10deg)';
    armRight.style.transform = 'rotate(20deg)';
  }

  count++;
  totalCountEl.textContent = `Lượt chơi: ${count} / ${maxCount}`;
  roundRunning = false;

  // Tự động sang vòng tiếp theo sau 8s
  setTimeout(() => {
    if(count < maxCount) {
      startRound();
    } else {
      predictionEl.textContent = 'Hoàn thành 20 lượt chơi!';
      armLeft.style.transform = 'rotate(0deg)';
      armRight.style.transform = 'rotate(0deg)';
    }
  }, 8000);
}

// Khoá/Mở mẹo chơi
lockTipsBtn.onclick = () => {
  tipsLocked = !tipsLocked;
  if(tipsLocked) {
    tipsText.classList.add('locked');
    lockTipsBtn.textContent = 'Khóa';
    lockTipsBtn.classList.remove('locked');
    lockTipsBtn.setAttribute('aria-pressed', 'false');
  } else {
    tipsText.classList.remove('locked');
    lockTipsBtn.textContent = 'Mở khóa';
    lockTipsBtn.classList.add('locked');
    lockTipsBtn.setAttribute('aria-pressed', 'true');
  }
};
// Khởi đầu khóa mẹo
tipsText.classList.add('locked');
