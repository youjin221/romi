const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 캔버스 크기
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 이미지 로드
const basketImg = new Image();
basketImg.src = "heart.jpeg"; // 바구니 이미지

// 플레이어 바구니
const catcher = {
  width: 100,
  height: 100,
  x: canvas.width / 2 - 50,
  y: canvas.height - 150
};

// 떨어지는 공
const hearts = [];
const heartSize = 30;
let score = 0;

function createHeart() {
  const x = Math.random() * (canvas.width - heartSize);
  hearts.push({ x: x, y: -heartSize });
}

function drawCatcher() {
  ctx.drawImage(basketImg, catcher.x, catcher.y, catcher.width, catcher.height);
}

function drawHearts() {
  ctx.fillStyle = "red";
  hearts.forEach((heart) => {
    ctx.beginPath();
    ctx.arc(heart.x + heartSize / 2, heart.y + heartSize / 2, heartSize / 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function moveHearts() {
  hearts.forEach((heart, index) => {
    heart.y += 5;

    // 충돌 체크
    if (
      heart.y + heartSize >= catcher.y &&
      heart.x + heartSize >= catcher.x &&
      heart.x <= catcher.x + catcher.width
    ) {
      hearts.splice(index, 1);
      score++;
    }

    // 떨어졌을 때
    if (heart.y > canvas.height) {
      hearts.splice(index, 1);
      score--;
    }
  });
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCatcher();
  drawHearts();
  moveHearts();
  drawScore();
  requestAnimationFrame(gameLoop);
}

// 마우스 조작 (PC)
// 터치 조작 (모바일) + 스크롤 방지
document.addEventListener("touchmove", function (e) {
  e.preventDefault(); // Safari 화면 흔들림 방지
  const touchX = e.touches[0].clientX;
  catcher.x = touchX - catcher.width / 2;
}, { passive: false });


// 하트 생성 주기
setInterval(createHeart, 1000);

// 이미지 로드된 후 게임 시작
basketImg.onload = () => {
  gameLoop();
};
