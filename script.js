const scene = document.querySelector("#scene");
const actions = document.querySelector("#actions");
const noButton = document.querySelector("#no");
const toast = document.querySelector("#toast");
const hint = document.querySelector("#hint");
const transitionWash = document.querySelector("#transition-wash");
const fallingStars = document.querySelector("#falling-stars");
const eyebrow = document.querySelector(".eyebrow");
const question = document.querySelector("#question");
const intro = document.querySelector("#intro");
let attempts = 0;
let toastTimer;
let currentStage = "question";

function dodgeNo() {
  if (currentStage !== "question") return;
  const area = actions.getBoundingClientRect();
  const button = noButton.getBoundingClientRect();
  const maxX = Math.max(0, area.width - button.width);
  const maxY = 12;
  const currentX = noButton.offsetLeft;
  const currentY = noButton.offsetTop;
  let nextX = currentX;
  let nextY = currentY;

  for (let tries = 0; tries < 8 && Math.hypot(nextX - currentX, nextY - currentY) < 50; tries++) {
    nextX = Math.random() * maxX;
    nextY = (Math.random() * 2 - 1) * maxY;
  }

  noButton.style.left = `${nextX}px`;
  noButton.style.right = "auto";
  noButton.style.top = `${nextY}px`;
  attempts++;
  hint.textContent = attempts < 3 ? "Escolha errada nenezinha ✧" : "Acho que você foi feita para mim ✧";

  if (attempts === 3) {
    toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 3800);
  }
}

function renderStage(stage) {
  currentStage = stage;
  toast.classList.remove("visible");

  if (stage === "love") {
    scene.classList.remove("success");
    scene.classList.add("love-stage");
    eyebrow.textContent = "Uma mensagem do coração ";
    question.innerHTML = 'Leia com bastante <span>carinho..</span>';
    intro.textContent = "Eu te amo muito, quero que você saiba que você é a pessoa mais importante da minah vida, e quero passar minha vida inteirinha com você, agora namorados e depois noivados e casamentos, vou te honrar todos os dias, com amor do seu Dedézinho.";
    actions.innerHTML = '<button class="yes continue" id="continue" type="button"><span aria-hidden="true">✦</span> Continuar</button>';
    hint.textContent = "Com todo o meu carinho ✧";
    return;
  }

  scene.classList.remove("love-stage");
  scene.classList.add("success");
  eyebrow.textContent = "Nossa história começa aqui";
  question.innerHTML = 'Obrigado por dizer <span>sim ✦</span>';
  intro.textContent = "Eu te amo, e mal posso esperar para ver esse rostinho lindo de perto";
  actions.replaceChildren();
  hint.innerHTML = '<span class="heart" aria-hidden="true">♥</span> Eu e você, sob as mesmas estrelas. <span class="heart" aria-hidden="true">♥</span>';
}

function beginTransition(nextStage) {
  if (scene.classList.contains("falling")) return;
  toast.classList.remove("visible");
  clearTimeout(toastTimer);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    renderStage(nextStage);
    return;
  }

  fallingStars.replaceChildren();
  for (let index = 0; index < 24; index++) {
    const star = document.createElement("span");
    star.style.setProperty("--x", `${Math.random() * 110 - 5}%`);
    star.style.setProperty("--delay", `${Math.random() * 0.3}s`);
    star.style.setProperty("--duration", `${1 + Math.random() * 0.45}s`);
    star.style.setProperty("--size", `${5 + Math.random() * 10}px`);
    star.style.setProperty("--drift", `${Math.random() * 24 - 12}vw`);
    star.style.setProperty("--rotation", `${Math.random() * 120 - 60}deg`);
    fallingStars.append(star);
  }

  transitionWash.addEventListener("animationend", (event) => {
    if (event.target !== transitionWash) return;
    scene.classList.remove("falling");
    renderStage(nextStage);
  }, { once: true });
  scene.classList.add("falling");
}

noButton.addEventListener("pointerenter", dodgeNo);
noButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  dodgeNo();
});
noButton.addEventListener("click", (event) => {
  event.preventDefault();
  dodgeNo();
});
noButton.addEventListener("focus", dodgeNo);

actions.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.id === "yes") beginTransition("love");
  if (button.id === "continue") beginTransition("thanks");
});