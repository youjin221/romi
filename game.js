const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 캔버스 크기
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 이미지 로드
const basketImg = new Image();
basketImg.src = "heart.jpeg"; // 바구니 이미지

// 바구니 설정
const catcher = {
  width: 100,
  height: 100,
  x: canvas.width / 2 - 50,
  y: canvas.height - 150
};

// 하트 + 폭탄 공통 설정
const objects = [];
const objectSize = 30;
let score = 0;

// 하트 또는 폭탄 생성
function createObject() {
  const x = Math.random() * (canvas.width - objectSize);
  const isBomb = Math.random() < 0.3; // 30% 확률로 폭탄
  const type = isBomb ? "bomb" : "heart";
  objects.push({ x: x, y: -objectSize, type: type });
}

// 바구니 그리기
function drawCatcher() {
  ctx.drawImage(basketImg, catcher.x, catcher.y, catcher.width, catcher.height);
}

// 하트와 폭탄 그리기
function drawObjects() {
  objects.forEach((obj) => {
    if (obj.type === "heart") {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "black"; // 폭탄은 검은색
    }
    ctx.beginPath();
    ctx.arc(obj.x + objectSize / 2, obj.y + objectSize / 2, objectSize / 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

// 하트, 폭탄 움직이기 + 충돌 처리
function moveObjects() {
  for (let i = objects.length - 1; i >= 0; i--) {
    const obj = objects[i];
    obj.y += 5;

    const caught =
      obj.y + objectSize >= catcher.y &&
      obj.x + objectSize >= catcher.x &&
      obj.x <= catcher.x + catcher.width;

    if (caught) {
      if (obj.type === "heart") {
        score++;
      } else if (obj.type === "bomb") {
        score -= 5;
      }
      objects.splice(i, 1); // 제거
      continue;
    }

    // 화면 아래로 떨어짐
    if (obj.y > canvas.height) {
      if (obj.type === "heart") {
        score--;
      }
      objects.splice(i, 1);
    }
  }
}

// 점수 출력
function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

// 메인 게임 루프
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCatcher();
  drawObjects();
  moveObjects();
  drawScore();
  requestAnimationFrame(gameLoop);
}

// 터치 조작
document.addEventListener("touchmove", function (e) {
  const touchX = e.touches[0].clientX;
  catcher.x = touchX - catcher.width / 2;
});

// 마우스 조작
document.addEventListener("mousemove", function (e) {
  const mouseX = e.clientX;
  catcher.x = mouseX - catcher.width / 2;
});

// 생성 주기
setInterval(createObject, 1000);

// 이미지가 로드되면 게임 시작
basketImg.onload = () => {
  gameLoop();
};
