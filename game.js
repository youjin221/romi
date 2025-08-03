const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 캔버스 크기
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 바구니 이미지 로드
const basketImg = new Image();
basketImg.src = "heart.jpeg"; // 꼭 같은 폴더에 있어야 함

// 바구니 설정
const catcher = {
  width: 100,
  height: 100,
  x: canvas.width / 2 - 50,
  y: canvas.height - 150
};

// 떨어지는 오브젝트들 (하트 + 폭탄)
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

// 하트/폭탄 그리기
function drawObjects() {
  objects.forEach((obj) => {
    ctx.fillStyle = obj.type === "heart" ? "red" : "black";
    ctx.beginPath();
    ctx.arc(obj.x + objectSize / 2, obj.y + objectSize / 2, objectSize / 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

// 오브젝트 움직이고 충돌 확인
function moveObjects() {
  for (let i = objects.length - 1; i >= 0; i--) {
    const obj = objects[i];
    obj.y += 5;

    const caught =
      obj.y + objectSize >= catcher.y &&
      obj.x + objectSize >= catcher.x &&
      obj.x <= catcher.x + catcher.width;

    if (caught) {
      if (obj.type === "heart") score++;
      else if (obj.type === "bomb") score -= 5;
      objects.splice(i, 1);
      continue;
    }

    // 바닥까지 떨어짐
    if (obj.y > canvas.height) {
      if (obj.type === "heart") score--;
      objects.splice(i, 1);
    }
  }
}

// 점수 표시
function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

// 메인 루프
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCatcher();
  drawObjects();
  moveObjects();
  drawScore();
  requestAnimationFrame(gameLoop);
}

// 마우스 조작 (PC)
canvas.addEventListener("mousemove", function (e) {
  catcher.x = e.clientX - catcher.width / 2;
});

// 터치 조작 (모바일)
canvas.addEventListener("touchmove", function (e) {
  catcher.x = e.touches[0].clientX - catcher.width / 2;
  e.preventDefault();
}, { passive: false });

// 오브젝트 생성 주기
setInterval(createObject, 1000);

// 이미지 로드 완료 후 시작
basketImg.onload = () => {
  gameLoop();
};
