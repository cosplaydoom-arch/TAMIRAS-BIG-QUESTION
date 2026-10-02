const screens = document.querySelectorAll(".screen");

function showScreen(id) {
  screens.forEach(screen => screen.classList.remove("active"));
  const target = document.getElementById(id);
  target.classList.add("active");
}

document.querySelectorAll("[data-next]").forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.next));
});

document.getElementById("character").addEventListener("click", () => {
  const character = document.getElementById("character");
  character.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(.94)" },
      { transform: "scale(1.04)" },
      { transform: "scale(1)" }
    ],
    { duration: 300, easing: "ease-out" }
  );

  setTimeout(() => showScreen("question-screen"), 350);
});

// Cute floating hearts on the opening screen
function createFloatingHearts(container, count, final = false) {
  const symbols = ["♥", "♡", "✦", "✧"];
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = final ? "final-heart" : "floating-heart";
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = (12 + Math.random() * 24) + "px";
    heart.style.animationDuration = (5 + Math.random() * 8) + "s";
    heart.style.animationDelay = (-Math.random() * 10) + "s";
    container.appendChild(heart);
  }
}

createFloatingHearts(document.querySelector(".floating-hearts"), 18);

const noButton = document.getElementById("no");
let noAttempts = 0;

function moveNoButton() {
  noAttempts++;

  // On mobile and desktop, move it around within the answer area.
  const parent = noButton.parentElement;
  const maxX = Math.max(30, parent.clientWidth - noButton.offsetWidth - 10);
  const x = Math.random() * maxX - (parent.clientWidth / 2 - noButton.offsetWidth / 2);
  const y = (Math.random() * 120) - 60;

  noButton.style.transform = `translate(${x}px, ${y}px)`;

  if (noAttempts >= 4) {
    noButton.textContent = "NOPE 😭";
  }
}

noButton.addEventListener("mouseenter", moveNoButton);
noButton.addEventListener("click", (e) => {
  e.preventDefault();
  moveNoButton();
});

// YES = the big ending
document.getElementById("yes").addEventListener("click", () => {
  showScreen("final-screen");
  createFloatingHearts(document.querySelector(".final-hearts"), 35, true);
  startConfetti();
});

// Pixel confetti
function startConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  const pieces = [];
  const shapes = ["square", "heart", "diamond"];
  const colors = ["#ff76a8", "#ffabc9", "#e64f88", "#ffd6e7", "#ffffff"];

  // Huge initial burst
  for (let i = 0; i < 190; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 13;

    pieces.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: 4 + Math.random() * 9,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - .5) * .2,
      gravity: .12 + Math.random() * .08,
      life: 130 + Math.random() * 120,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  function drawHeart(ctx, x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.moveTo(0, size * .35);
    ctx.bezierCurveTo(-size * .8, -size * .15, -size * .55, -size * .75, 0, -size * .35);
    ctx.bezierCurveTo(size * .55, -size * .75, size * .8, -size * .15, 0, size * .35);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.life--;

      ctx.fillStyle = p.color;

      if (p.shape === "heart") {
        drawHeart(ctx, p.x, p.y, p.size, p.rotation);
      } else if (p.shape === "diamond") {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }

      if (p.life <= 0 || p.y > window.innerHeight + 50) {
        pieces.splice(i, 1);
      }
    }

    if (pieces.length > 0) requestAnimationFrame(animate);
  }

  animate();
}

// Small keyboard convenience
document.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const active = document.querySelector(".screen.active");
    if (active.id === "start-screen") showScreen("character-screen");
    else if (active.id === "character-screen") document.getElementById("character").click();
    else if (active.id === "question-screen") document.getElementById("yes").click();
  }
});
