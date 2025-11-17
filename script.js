// --------------------
// BALLOONS
// --------------------
function createBalloon() {
  const balloon = document.createElement("div");
  balloon.classList.add("balloon");

  // Random size
  const size = Math.random() * 40 + 60;
  balloon.style.width = `${size}px`;
  balloon.style.height = `${size * 1.25}px`;

  // Colors: blue + white
  const colors = ["#0077b6", "#48cae4", "#90e0ef", "#ffffff"];
  balloon.style.background = colors[Math.floor(Math.random() * colors.length)];

  // Position & speed
  balloon.style.left = `${Math.random() * window.innerWidth}px`;
  balloon.style.animationDuration = `${Math.random() * 4 + 6}s`;

  document.body.appendChild(balloon);

  // Remove balloon after floating
  setTimeout(() => balloon.remove(), 12000);
}

// Create a balloon every 600ms
setInterval(createBalloon, 600);


// --------------------
// SILVER CONFETTI
// --------------------
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class ConfettiPiece {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 4 + 2;
    this.speed = Math.random() * 3 + 1;
    this.opacity = Math.random();
  }
  draw() {
    ctx.fillStyle = `rgba(180,180,180,${this.opacity})`;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
  update() {
    this.y += this.speed;
    if (this.y > canvas.height) {
      this.y = -5;
      this.x = Math.random() * canvas.width;
    }
  }
}

const confettiArray = [];
for (let i = 0; i < 180; i++) confettiArray.push(new ConfettiPiece());

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiArray.forEach((c) => {
    c.update();
    c.draw();
  });
  requestAnimationFrame(animateConfetti);
}

animateConfetti();

   

