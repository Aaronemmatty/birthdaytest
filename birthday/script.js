/* =====================================================
   BIRTHDAY SURPRISE — script.js
   All interactions, animations, transitions, effects
   ===================================================== */

// ===================== PERSONALISATION =====================
const CONFIG = {
  name: "Sneeha",          // 🔧 Change this to the birthday person's name!
  birthdayDate: "2004-05-15",      // 🔧 Change to their actual birthday (YYYY-MM-DD)
  giftMessage: "My gift to you is this I hope you like this and keep having fun in life just wanted to tell you that i am proud of you . You are the sun in everyones life. Here's to celebrating YOU — today, tomorrow, and always. Keep shining, superstar ily. 🌟💖",
  heartfeltMessage: `Some people walk into your life and quietly become your whole world. That's exactly what you've done.\n\nEvery laugh shared, every late-night chat, every moment of complete silliness — those are the things I treasure most. You don't just make life fun — you make it *better*.\n\nSo today, on this very special day, I want you to know: you are deeply loved, wildly appreciated, and absolutely irreplaceable.\n\nHappy Birthday. 🎂💖`,
  memories: [
    { year: "Day 1",   desc: "You entered the world and immediately became the main character 👑" },
    { year: "Chapter 2", desc: "First laugh. First trouble. First adventure." },
    { year: "Plot twist", desc: "You decided chaos was a lifestyle and we stan you for it 🌪️" },
    { year: "Level up",  desc: "Became the most iconic version of yourself (still evolving)" },
    { year: "Today",    desc: "Another year wiser, funnier, and more irreplaceable than ever 🎉" },
  ],
  reasons: [
    { icon: "🌟", text: "Your laugh is genuinely contagious" },
    { icon: "💡", text: "You make everything more fun just by being there" },
    { icon: "🤝", text: "The most loyal person in any room" },
    { icon: "🎯", text: "You go after what you want, no matter what" },
    { icon: "🌈", text: "You bring colour into grey days" },
    { icon: "🧠", text: "Scarily intelligent (but humble about it)" },
    { icon: "💪", text: "Resilient beyond words" },
    { icon: "❤️", text: "You love deeply and fully" },
  ],
};

// ===================== STATE =====================
let currentSlide    = 0;
let q2NoClickCount  = 0;
let starClickCount  = 0;
let musicPlaying    = false;
let audioCtx        = null;
let progressStep    = 0;
const TOTAL_STEPS   = 5; // loading, q1, q2, q3, final
const FLOAT_MSGS    = [
  "You look amazing today ✨",
  "Certified birthday legend 🎂",
  "Smile detected 😊",
  "High pookie meter 👑",
  "Spreading joy since birth 🌟",
  "100% that legend 💅",
  "Officially another year fabulous 🎉",
];

// ===================== DOM HELPERS =====================
const $ = id => document.getElementById(id);
const show = id => $(id).style.display = '';
const hide = id => $(id).style.display = 'none';

// ===================== SCREEN TRANSITIONS =====================
function goToScreen(id, delay = 0) {
  setTimeout(() => {
    // Exit all active screens
    document.querySelectorAll('.screen.active').forEach(s => {
      s.classList.add('exit');
      setTimeout(() => { s.classList.remove('active','exit'); }, 500);
    });
    // Activate new screen
    setTimeout(() => {
      const next = $(id);
      next.classList.add('active');
    }, 300);
  }, delay);
}

// ===================== MINI LOADING =====================
const miniMessages = [
  "Calibrating cuteness…",
  "Brewing birthday magic…",
  "Loading more love…",
  "Charging the vibes…",
];
function showMiniLoad(nextScreen, message = null) {
  $('miniLoadText').textContent = message || miniMessages[Math.floor(Math.random() * miniMessages.length)];
  goToScreen('miniLoadScreen');
  setTimeout(() => goToScreen(nextScreen), 1400);
}

// ===================== PROGRESS BAR =====================
function setProgress(step) {
  progressStep = step;
  const pct = Math.round((step / TOTAL_STEPS) * 100);
  $('progressBar').style.width = pct + '%';
  $('progressLabel').textContent = pct + '%';
  $('progressBarWrap').classList.add('visible');
}

// ===================== LOVE.EXE LOADING SCREEN =====================
function runLoadingScreen() {
  const lines = [
    "Initializing birthday module…",
    "Loading happiness.dll…",
    "Installing confetti drivers…",
    "Calibrating heart emojis…",
    "Compiling memories…",
    "Almost ready…",
  ];
  let pct = 0;
  let lineIdx = 0;
  const lineEls = [$('exeLine1'), $('exeLine2'), $('exeLine3')];

  const interval = setInterval(() => {
    pct += Math.random() * 12 + 3;
    if (pct > 100) pct = 100;
    $('exeBar').style.width = pct + '%';
    $('exePct').textContent = Math.round(pct) + '%';

    if (lineIdx < lines.length) {
      lineEls[lineIdx % 3].textContent = '> ' + lines[lineIdx];
      lineIdx++;
    }

    if (pct >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        goToScreen('landingScreen');
        typeHeroText();
        startBgParticles();
        startFloatingMessages();
        setTimeout(startCursorTrail, 500);
      }, 600);
    }
  }, 200);
}

// ===================== TYPEWRITER HELPER =====================
function typeText(el, text, speed = 35, cb) {
  el.textContent = '';
  let i = 0;
  const t = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) { clearInterval(t); if (cb) cb(); }
  }, speed);
}

function typeHeroText() {
  const title = $('heroTitle');
  const sub   = $('heroSub');
  typeText(title, `Hey Bestie 😘`, 55, () => {
    setTimeout(() => typeText(sub, `I made something special just for you…`, 42), 300);
  });
}

// ===================== BACKGROUND PARTICLES =====================
function startBgParticles() {
  const canvas = $('bgCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const EMOJIS  = ['✨','💖','🌟','💫','🎀','⭐','💕','🎈'];
  const particles = Array.from({ length: 55 }, () => ({
    x:    Math.random() * canvas.width,
    y:    Math.random() * canvas.height,
    vy:   -(Math.random() * .6 + .2),
    vx:   (Math.random() - .5) * .4,
    size: Math.random() * 16 + 10,
    emoji:EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    alpha:Math.random() * .5 + .2,
    rot:  Math.random() * Math.PI * 2,
    rotV: (Math.random() - .5) * .02,
    // track star/heart clicks for easter egg
    isClickable: Math.random() < .2,
  }));

  // Easter egg — track clicks on particles drawn on canvas is tricky,
  // so we layer invisible divs for clickable ones (done in separate fn)

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.font = `${p.size}px serif`;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillText(p.emoji, -p.size/2, p.size/2);
      ctx.restore();
      p.y  += p.vy;
      p.x  += p.vx;
      p.rot += p.rotV;
      if (p.y < -30) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      if (p.x < -30) p.x = canvas.width + 10;
      if (p.x > canvas.width + 30) p.x = -10;
    });
    requestAnimationFrame(draw);
  }
  draw();
  createEasterEggStars();
}

// ===================== EASTER EGG STARS =====================
function createEasterEggStars() {
  for (let i = 0; i < 6; i++) {
    const star = document.createElement('div');
    star.className = 'easter-star';
    star.textContent = '⭐';
    star.style.cssText = `
      position: fixed;
      left: ${Math.random() * 90}%;
      top: ${Math.random() * 80}%;
      font-size: ${18 + Math.random() * 14}px;
      cursor: pointer;
      z-index: 50;
      transition: transform .15s;
      user-select: none;
      filter: drop-shadow(0 0 6px #fbbf24);
      animation: balloonFloat ${2+Math.random()*2}s ease-in-out infinite;
    `;
    star.addEventListener('click', () => {
      starClickCount++;
      star.style.transform = 'scale(1.5)';
      setTimeout(() => star.style.transform = '', 200);
      if (starClickCount >= 5) {
        $('easterModal').classList.add('open');
        triggerConfetti(80);
        starClickCount = 0;
      }
    });
    document.body.appendChild(star);
  }
}

// ===================== FLOATING MESSAGES =====================
function startFloatingMessages() {
  const container = $('floatingMessages');
  setInterval(() => {
    const msg = document.createElement('div');
    msg.className = 'float-msg';
    msg.textContent = FLOAT_MSGS[Math.floor(Math.random() * FLOAT_MSGS.length)];
    msg.style.left = (10 + Math.random() * 75) + '%';
    msg.style.bottom = (5 + Math.random() * 20) + '%';
    container.appendChild(msg);
    setTimeout(() => msg.remove(), 5200);
  }, 3500);
}

// ===================== CUSTOM CURSOR =====================
function startCursorTrail() {
  const cursor = $('cursorGlow');
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
  document.addEventListener('mousedown', () => cursor.classList.add('clicked'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('clicked'));
}

// ===================== CONFETTI =====================
function triggerConfetti(count = 60) {
  const container = $('confettiContainer');
  const colors = ['#ff6bcb','#a78bfa','#38bdf8','#fbbf24','#34d399','#f472b6','#818cf8'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const size = 6 + Math.random() * 10;
    piece.style.cssText = `
      left: ${Math.random()*100}%;
      top: -${size}px;
      width: ${size}px; height: ${size}px;
      background: ${colors[Math.floor(Math.random()*colors.length)]};
      border-radius: ${Math.random() > .5 ? '50%' : '2px'};
      animation-duration: ${1.4 + Math.random()*2}s;
      animation-delay: ${Math.random()*600}ms;
    `;
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 3500);
  }
}

// ===================== SIMPLE AUDIO (Web Audio API) =====================
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playTone(freq = 523, dur = 0.12, vol = 0.15) {
  try {
    initAudio();
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  } catch(e) {}
}

function playSuccessChime() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((n, i) => setTimeout(() => playTone(n, .18, .12), i * 120));
}

function playErrorSound() {
  playTone(220, .25, .1);
  setTimeout(() => playTone(180, .25, .1), 200);
}

function playClickSound() {
  playTone(880, .06, .06);
}

// Birthday "music" — simple loop of happy arpeggios
let bgMusicInterval = null;
const BDAY_MELODY = [523, 523, 587, 523, 698, 659, 523, 523, 587, 523, 784, 698, 523, 523, 1047, 880, 698, 659, 587, 932, 932, 880, 698, 784, 698];
let melodyIdx = 0;

function toggleMusic() {
  initAudio();
  musicPlaying = !musicPlaying;
  $('musicToggle').textContent = musicPlaying ? '🔇' : '🎵';
  if (musicPlaying) {
    bgMusicInterval = setInterval(() => {
      playTone(BDAY_MELODY[melodyIdx % BDAY_MELODY.length], .28, .08);
      melodyIdx++;
    }, 340);
  } else {
    clearInterval(bgMusicInterval);
  }
}

// ===================== FIREWORKS (Final Screen) =====================
let fwCanvas, fwCtx, fwParticles = [];

function startFireworks() {
  fwCanvas = $('fireworksCanvas');
  fwCtx    = fwCanvas.getContext('2d');
  fwCanvas.width  = window.innerWidth;
  fwCanvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    fwCanvas.width  = window.innerWidth;
    fwCanvas.height = window.innerHeight;
  });
  setInterval(launchFirework, 900);
  animateFireworks();
}

function launchFirework() {
  const x = 100 + Math.random() * (fwCanvas.width - 200);
  const y = 60  + Math.random() * (fwCanvas.height * .5);
  const colors = ['#ff6bcb','#fbbf24','#a78bfa','#38bdf8','#34d399','#f472b6'];
  const color  = colors[Math.floor(Math.random() * colors.length)];
  for (let i = 0; i < 55; i++) {
    const angle = (Math.PI * 2 / 55) * i + Math.random() * .2;
    const speed = 2 + Math.random() * 4;
    fwParticles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      color,
      size: 2 + Math.random() * 3,
      gravity: .06,
    });
  }
}

function animateFireworks() {
  fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
  fwParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= .98;
    p.alpha -= .016;
    fwCtx.save();
    fwCtx.globalAlpha = Math.max(p.alpha, 0);
    fwCtx.beginPath();
    fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    fwCtx.fillStyle = p.color;
    fwCtx.shadowBlur = 8;
    fwCtx.shadowColor = p.color;
    fwCtx.fill();
    fwCtx.restore();
  });
  fwParticles = fwParticles.filter(p => p.alpha > 0);
  requestAnimationFrame(animateFireworks);
}

// ===================== COUNTDOWN TIMER =====================
function startCountdown() {
  const bday = new Date(CONFIG.birthdayDate);
  function update() {
    const now = new Date();
    const diff = now - bday;
    if (diff < 0) return;

    // Calculate age in years
    let years = now.getFullYear() - bday.getFullYear();
    let months = now.getMonth() - bday.getMonth();
    let days = now.getDate() - bday.getDate();

    // Adjust if birthday hasn't occurred this year yet
    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }

    // Adjust days
    if (days < 0) {
      months--;
      // Get days in previous month
      const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const daysInPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += daysInPrevMonth;
    }

    // Calculate hours, minutes, seconds since last birthday
    const lastBirthday = new Date(now.getFullYear() - (years > 0 ? 0 : 1), bday.getMonth(), bday.getDate());
    if (lastBirthday > now) {
      lastBirthday.setFullYear(lastBirthday.getFullYear() - 1);
    }

    const timeSinceBirthday = now - lastBirthday;
    const hours = Math.floor(timeSinceBirthday / (1000 * 60 * 60)) % 24;
    const mins = Math.floor(timeSinceBirthday / (1000 * 60)) % 60;
    const secs = Math.floor(timeSinceBirthday / 1000) % 60;

    const pad = n => String(n).padStart(2,'0');
    $('cdYears').textContent  = pad(years);
    $('cdMonths').textContent = pad(months);
    $('cdDays').textContent   = pad(days);
    $('cdHours').textContent  = pad(hours);
    $('cdMins').textContent   = pad(mins);
    $('cdSecs').textContent   = pad(secs);
  }
  update();
  setInterval(update, 1000);
}

// ===================== GALLERY =====================
let gallerySlides, galleryDotEls;

function initGallery() {
  gallerySlides = document.querySelectorAll('.gallery-slide');
  const dotsContainer = $('galleryDots');
  dotsContainer.innerHTML = '';
  gallerySlides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'g-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  galleryDotEls = dotsContainer.querySelectorAll('.g-dot');
  
  $('gPrev').addEventListener('click', () => { playClickSound(); goToSlide((currentSlide - 1 + gallerySlides.length) % gallerySlides.length); });
  $('gNext').addEventListener('click', () => { playClickSound(); goToSlide((currentSlide + 1) % gallerySlides.length); });

  // Auto-advance
  setInterval(() => goToSlide((currentSlide + 1) % gallerySlides.length), 3500);
}

function goToSlide(idx) {
  gallerySlides[currentSlide].classList.remove('active');
  galleryDotEls[currentSlide].classList.remove('active');
  currentSlide = idx;
  gallerySlides[currentSlide].classList.add('active');
  galleryDotEls[currentSlide].classList.add('active');
}

// ===================== REASONS GRID =====================
function buildReasons() {
  const grid = $('reasonsGrid');
  CONFIG.reasons.forEach((r, i) => {
    const card = document.createElement('div');
    card.className = 'reason-card fade-in-up';
    card.style.transitionDelay = (i * 80) + 'ms';
    card.innerHTML = `<div class="reason-icon">${r.icon}</div><div class="reason-text">${r.text}</div>`;
    grid.appendChild(card);
  });
}

// ===================== TIMELINE =====================
function buildTimeline() {
  const tl = $('timeline');
  CONFIG.memories.forEach((m, i) => {
    const item = document.createElement('div');
    item.className = 'tl-item';
    item.style.transitionDelay = (i * 100) + 'ms';
    item.innerHTML = `<div class="tl-dot"></div><div class="tl-year">${m.year}</div><div class="tl-desc">${m.desc}</div>`;
    tl.appendChild(item);
  });
}

// ===================== SCROLL OBSERVER =====================
function initScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-in-up, .tl-item').forEach(el => observer.observe(el));
}

// ===================== HEART RAIN =====================
function triggerHeartRain(container) {
  container.innerHTML = '';
  const hearts = ['💖','💕','❤️','💗','💓','💞','🌹','✨'];
  for (let i = 0; i < 30; i++) {
    const h = document.createElement('div');
    h.className = 'heart-particle';
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    h.style.left = Math.random() * 100 + '%';
    h.style.animationDuration = (1.5 + Math.random() * 2) + 's';
    h.style.animationDelay = (Math.random() * .8) + 's';
    h.style.fontSize = (16 + Math.random() * 20) + 'px';
    container.appendChild(h);
  }
}

// ===================== FINAL SCREEN SETUP =====================
function setupFinalScreen() {
  // Big heading typewriter
  setTimeout(() => typeText($('bigBday'), `Happy Birthday, ${CONFIG.name}! ❤️`, 60), 400);

  // Heartfelt typewriter message
  setTimeout(() => typeText($('typewriterText'), CONFIG.heartfeltMessage, 22), 1200);

  // Countdown
  startCountdown();

  // Gallery
  initGallery();

  // Reasons
  buildReasons();

  // Timeline
  buildTimeline();

  // Fireworks
  startFireworks();

  // Continuous confetti
  setInterval(() => triggerConfetti(15), 2500);

  // Auto-music on final screen
  setTimeout(() => {
    if (!musicPlaying) toggleMusic();
  }, 800);

  // Scroll observer
  setTimeout(initScrollObserver, 600);

  // Gift button
  $('giftBtn').addEventListener('click', () => {
    playSuccessChime();
    triggerConfetti(120);
    $('modalMessage').textContent = CONFIG.giftMessage;
    $('giftModal').classList.add('open');
    triggerHeartRain($('heartRain'));
  });

  // Modal close
  $('modalClose').addEventListener('click', () => {
    $('giftModal').classList.remove('open');
  });
  $('giftModal').addEventListener('click', e => {
    if (e.target === $('giftModal')) $('giftModal').classList.remove('open');
  });
}

// ===================== QUESTION LOGIC =====================
function initQuestions() {

  /* ---- Q1 ---- */
  const q1Yes = document.querySelector('#q1Screen .yes-btn');
  const q1No  = document.querySelector('#q1Screen .no-btn');
  const popup1 = $('popup1');

  q1Yes.addEventListener('click', () => {
    playSuccessChime();
    triggerConfetti(40);
    setProgress(2);
    showMiniLoad('q2Screen', 'Warming up the awesomeness…');
  });

  q1No.addEventListener('click', () => {
    playErrorSound();
    show('popup1');
  });

  document.querySelector('#q1Screen .back-btn').addEventListener('click', () => {
    playClickSound();
    hide('popup1');
  });

  /* ---- Q2 ---- */
  const q2Yes = $('q2Yes');
  const q2No  = $('q2No');
  const popup2 = $('popup2');
  let q2Size = 1;

  q2Yes.addEventListener('click', () => {
    playSuccessChime();
    triggerConfetti(60);
    setProgress(3);
    showMiniLoad('q3Screen', 'Charging the surprise vibes…');
  });

  q2No.addEventListener('click', () => {
    playErrorSound();
    q2NoClickCount++;
    // Shake NO button
    q2No.classList.remove('shake');
    void q2No.offsetWidth;
    q2No.classList.add('shake');
    setTimeout(() => q2No.classList.remove('shake'), 550);
    // Grow YES button
    q2Size = Math.min(q2Size + .07, 1.5);
    q2Yes.style.transform = `scale(${q2Size})`;
    q2Yes.style.fontSize  = Math.min(16 + q2NoClickCount * 1.5, 28) + 'px';
    // Show popup briefly
    show('popup2');
    setTimeout(() => hide('popup2'), 1600);
  });

  /* ---- Q3 ---- */
  const q3Yes  = document.querySelector('#q3Screen .yes-btn');
  const q3No   = document.querySelector('#q3Screen .no-btn');
  const popup3 = $('popup3');
  let q3NoDodge = 0;

  q3Yes.addEventListener('click', () => {
    playSuccessChime();
    triggerConfetti(80);
    setProgress(4);
    showMiniLoad('finalScreen', 'Unlocking the magic…');
    setTimeout(setupFinalScreen, 2200);
  });

  q3No.addEventListener('click', () => {
    // First 2 clicks → dodge
    q3NoDodge++;
    playErrorSound();
    if (q3NoDodge <= 2) {
      const angle = Math.random() * 360;
      const dist  = 80 + Math.random() * 100;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      q3No.style.transition = 'transform .25s ease';
      q3No.style.transform  = `translate(${dx}px, ${dy}px)`;
      setTimeout(() => { q3No.style.transform = ''; }, 600);
    }
    // Dramatic dark popup
    popup3.style.display = '';
    $('popup3Text').textContent = 'Mission failed… friendship damaged 💔';
    setTimeout(() => {
      $('popup3Text').textContent = 'Just kidding 😂 Press YES';
    }, 2100);
    setTimeout(() => { popup3.style.display = 'none'; }, 4000);
  });

  // Dodging NO on mouseover (for desktop)
  q3No.addEventListener('mousemove', () => {
    if (q3NoDodge > 0) {
      const r   = q3No.getBoundingClientRect();
      const dx  = (Math.random() - .5) * 160;
      const dy  = (Math.random() - .5) * 80;
      q3No.style.transition = 'transform .2s ease';
      q3No.style.transform  = `translate(${dx}px, ${dy}px)`;
      setTimeout(() => { q3No.style.transform = ''; }, 400);
    }
  });
}

// ===================== EASTER EGG CLOSE =====================
function initEasterEgg() {
  $('easterClose').addEventListener('click', () => $('easterModal').classList.remove('open'));
  $('easterModal').addEventListener('click', e => {
    if (e.target === $('easterModal')) $('easterModal').classList.remove('open');
  });
}

// ===================== THEME TOGGLE =====================
function initThemeToggle() {
  $('themeToggle').addEventListener('click', () => {
    playClickSound();
    const body = document.body;
    if (body.dataset.theme === 'dark') {
      body.dataset.theme = 'light';
      $('themeToggle').textContent = '☀️';
    } else {
      body.dataset.theme = 'dark';
      $('themeToggle').textContent = '🌙';
    }
  });
}

// ===================== MUSIC TOGGLE =====================
function initMusicToggle() {
  $('musicToggle').addEventListener('click', () => {
    playClickSound();
    toggleMusic();
  });
}

// ===================== LOCAL STORAGE PROGRESS =====================
function saveProgress(screen) {
  try { localStorage.setItem('bday_progress', screen); } catch(e) {}
}
function loadProgress() {
  try { return localStorage.getItem('bday_progress'); } catch(e) { return null; }
}

// ===================== START BUTTON =====================
function initStartBtn() {
  $('startBtn').addEventListener('click', () => {
    playSuccessChime();
    triggerConfetti(50);
    setProgress(1);
    showMiniLoad('q1Screen', 'Beginning the journey…');
    saveProgress('q1Screen');
  });
}

// ===================== GLOBAL BUTTON CLICK SOUNDS =====================
document.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON' && !e.target.classList.contains('yes-btn') && !e.target.classList.contains('no-btn')) {
    playClickSound();
  }
}, true);

// ===================== TOUCH SUPPORT FOR CURSOR =====================
document.addEventListener('touchmove', e => {
  const t = e.touches[0];
  const cursor = $('cursorGlow');
  cursor.style.left = t.clientX + 'px';
  cursor.style.top  = t.clientY + 'px';
}, { passive: true });

// ===================== BOOT =====================
window.addEventListener('DOMContentLoaded', () => {
  // Show loading screen immediately
  $('loadingScreen').classList.add('active');

  // Check for saved progress
  const saved = loadProgress();

  // Kick off love.exe
  setTimeout(() => {
    runLoadingScreen();
    initStartBtn();
    initQuestions();
    initEasterEgg();
    initThemeToggle();
    initMusicToggle();
    startCursorTrail();
  }, 200);

  // If user has already gotten past loading before, go directly on next reload
  // (we still show the full experience but could skip to saved screen)
  // For now, always show full experience for birthday magic!
});
