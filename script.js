const keyMap = {
  one: ["q", "7"],
  two: ["w", "8"],
  three: ["e", "9"],
  four: ["a", "4"],
  five: ["s", "5"],
  six: ["d", "6"],
  seven: ["z", "1"],
  eight: ["x", "2"],
  nine: ["c", "3"],
};


const buttons = Array.from(document.querySelectorAll(".buttons"));
const startbtn = document.getElementById("button1");
const leveldisplay = document.querySelector("#lnum p");
const instext = document.querySelector("#ins div");


let sequence = [];
let usersequence = [];
let level = 0;
let acceptinginput = false;
let playingsequence = false; // prevents input while computer is playing


const ids = Object.keys(keyMap); 
function getidbyindex(n) { return ids[n - 1]; } 


function flashButtonVisual(id, duration = 350) {
  const el = document.getElementById(id);
  if (!el) return;
 
  if (el.classList) el.classList.add("active");
  const prevBg = el.style.backgroundColor;
  el.style.backgroundColor = "aqua";
  setTimeout(() => {
    if (el.classList) el.classList.remove("active");
    el.style.backgroundColor = prevBg || ""; // restore
  }, duration);
}


function getRandomButtonId() {
  const keys = Object.keys(keyMap);
  return keys[Math.floor(Math.random() * keys.length)];
}


function playSequence() {
  if (!sequence.length) return;
  acceptinginput = false;
  playingsequence = true;
  instext.textContent = "Watch the sequence...";
  let i = 0;
  const gap = 650;
  const timer = setInterval(() => {
    const id = sequence[i];
    flashButtonVisual(id, Math.min(500, gap - 100));
    i++;
    if (i >= sequence.length) {
      clearInterval(timer);
      // small delay after sequence ends
      setTimeout(() => {
        acceptinginput = true;
        playingsequence = false;
        usersequence = [];
        instext.textContent = "Your turn!";
      }, 350);
    }
  }, gap);
}

// ---- add new random step and play ----
function nextRound() {
  level++;
  leveldisplay.textContent = level;
  sequence.push(getRandomButtonId());
  playSequence();
}

// ---- reset game state ----
function resetGame() {
  sequence = [];
  usersequence = [];
  level = 0;
  acceptinginput = false;
  playingsequence = false;
  leveldisplay.textContent = "0";
}


function handlePlayerAction(id) {
  // ignore input while computer is playing or not accepting
  if (!acceptinginput || playingsequence) return;
  flashButtonVisual(id, 200);
  usersequence.push(id);

  const idx = usersequence.length - 1;
  // compare current input with sequence
  if (usersequence[idx] !== sequence[idx]) {
    // wrong
    acceptinginput = false;
    instext.textContent = "❌ Wrong! Press Start / Enter to try again.";
    console.warn("Wrong input:", usersequence[idx], "expected:", sequence[idx]);
    return resetGame(); // user must restart
  }

  // correct so far
  if (usersequence.length === sequence.length) {
    // round complete
    acceptinginput = false;
    instext.textContent = "✅ Round complete!";
    setTimeout(nextRound, 800);
  }
}

// ---- attach click listeners to UI buttons ----
buttons.forEach(btn => {
  if (!btn.id) return;
  btn.addEventListener("click", () => {
    handlePlayerAction(btn.id);
  });
});

// ---- keyboard handling ----
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  // start/restart on Enter
  if (key === "enter") {
    // if currently playing sequence, ignore start presses
    if (!playingsequence) {
      resetGame();
      instext.textContent = "Starting...";
      setTimeout(nextRound, 250);
    }
    return;
  }

  // find mapped id for this key
  for (const id of Object.keys(keyMap)) {
    if (keyMap[id].includes(key)) {
      handlePlayerAction(id);
      break;
    }
  }
});


startbtn && startbtn.addEventListener("click", () => {
  if (!playingsequence) {
    resetGame();
    instext.textContent = "Starting...";
    setTimeout(nextRound, 250);
  }
});

instext && (instext.textContent = 'Click "Start" button or press Enter to begin');