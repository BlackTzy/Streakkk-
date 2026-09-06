 // ================= GLOBAL TWINKLING STARS ENGINE =================
    const starCanvas = document.getElementById('global-stars');
    const sCtx = starCanvas.getContext('2d');
    let stars = [];

    function resizeStarCanvas() {
      starCanvas.width = window.innerWidth;
      starCanvas.height = window.innerHeight;
      stars = [];
      const count = Math.floor((starCanvas.width * starCanvas.height) / 8000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * starCanvas.width,
          y: Math.random() * starCanvas.height,
          radius: Math.random() * 1.6 + 0.4,
          alpha: Math.random(),
          speed: Math.random() * 0.02 + 0.005,
          increasing: Math.random() > 0.5
        });
      }
    }
    window.addEventListener('resize', resizeStarCanvas);
    resizeStarCanvas();

    function renderStars() {
      sCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
      stars.forEach(s => {
        if (s.increasing) {
          s.alpha += s.speed;
          if (s.alpha >= 1) s.increasing = false;
        } else {
          s.alpha -= s.speed;
          if (s.alpha <= 0.1) s.increasing = true;
        }

        sCtx.beginPath();
        sCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        sCtx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        sCtx.shadowBlur = 8;
        sCtx.shadowColor = '#fff';
        sCtx.fill();
      });
      requestAnimationFrame(renderStars);
    }
    renderStars();

    // ================= FLOATING FLAMES & HEARTS GENERATOR =================
    const emojiContainer = document.getElementById('emoji-container');
    const flameEmojis = ['🔥', '⚡', '💎', '🔷'];
    const heartEmojis = ['💖', '💕', '❤️', '✨', '💓'];

    function spawnFloatingEmoji() {
      const el = document.createElement('div');
      const isFlame = Math.random() > 0.45;
      const list = isFlame ? flameEmojis : heartEmojis;
      const choice = list[Math.floor(Math.random() * list.length)];

      el.className = `floating-emoji ${isFlame ? 'flame-emoji' : 'heart-emoji'}`;
      el.innerText = choice;
      el.style.left = (Math.random() * 94 + 3) + 'vw';
      
      const duration = Math.random() * 3 + 5; // 5 to 8 seconds
      el.style.animationDuration = duration + 's';
      el.style.fontSize = (Math.random() * 1 + 1.6) + 'rem';

      emojiContainer.appendChild(el);
      setTimeout(() => el.remove(), duration * 1000);
    }
    setInterval(spawnFloatingEmoji, 350);

    // ================= AUDIO CONTEXT & SOUND FX =================
    let audioCtx;
    function getAudioContext() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      return audioCtx;
    }

    function playAudioFx(freq = 600, duration = 0.2) {
      try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch(e){}
    }

    // ================= MATRIX RAIN EFFECT =================
    const mCanvas = document.getElementById('matrix-canvas');
    const mCtx = mCanvas.getContext('2d');
    let matrixInterval;

    function startMatrix() {
      mCanvas.width = window.innerWidth;
      mCanvas.height = window.innerHeight;
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZFIRE100';
      const fontSize = 16;
      const columns = Math.floor(mCanvas.width / fontSize);
      const drops = Array(columns).fill(1);

      matrixInterval = setInterval(() => {
        mCtx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        mCtx.fillRect(0, 0, mCanvas.width, mCanvas.height);
        mCtx.fillStyle = '#ff1493';
        mCtx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          mCtx.fillText(text, i * fontSize, drops[i] * fontSize);
          if (drops[i] * fontSize > mCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }, 33);
    }

    // ================= INTERACTIVE LETTER DATA =================
    const letterPages = [
      {
        title: "Happy 100 Days! 💕",
        imgLeft: "",
        imgRight: ""
      },
      {
        title: " More streaks to comee 🔥",
        imgLeft: "15.jpg",
        imgRight: "24.jpg"
      },
      {
        title: " Anny!!!! 💖",
        imgLeft: "28.jpg",
        imgRight: "18.jpg"
      }
    ];

    let currentPage = 0;

    function openLetter() {
      playAudioFx(400, 0.2);
      document.getElementById('closed-card').style.display = 'none';
      document.getElementById('opened-letter').style.display = 'flex';
      document.getElementById('tap-instruction').innerText = '👆 I-tap para sa susunod na litrato (1/3)';
    }

    function handleLetterTap() {
      currentPage++;
      playAudioFx(500 + currentPage * 100, 0.2);

      if (currentPage < letterPages.length) {
        document.getElementById('page-title').innerText = letterPages[currentPage].title;
        document.getElementById('pic-left').src = letterPages[currentPage].imgLeft;
        document.getElementById('pic-right').src = letterPages[currentPage].imgRight;

        document.querySelectorAll('.dot').forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentPage);
        });
        document.getElementById('tap-instruction').innerText = `👆 I-tap para sa susunod (${currentPage + 1}/3)`;
      } else {
        const letterScreen = document.getElementById('interactive-letter-screen');
        const flameStage = document.getElementById('flame-stage');

        letterScreen.style.opacity = '0';
        setTimeout(() => {
          letterScreen.style.visibility = 'hidden';
          flameStage.classList.add('active');
          buildFlameCollage();
          startFireworks();
          
          const audio = document.getElementById('bg-audio');
          if (audio) audio.play().catch(()=>{});
        }, 600);
      }
    }

// ================= FLAME SHAPE PHOTO COLLAGE =================
function buildFlameCollage() {
  const container = document.getElementById('flame-collage');
  
  // Listahan ng 16 mong mga litrato (I-edit ang mga file names/URL dito)
  const myPhotos = [
    "1.jpg", "3.jpg", "15.jpg", "18.jpg",
    "24.jpg", "33.jpg", "30.jpg", "36.jpg",
    "14.jpg", "11.jpg", "24.jpg", "25.jpg",
    "19.jpg", "41.jpg", "34.jpg", "12.jpg"
  ];

  const flamePoints = [
    {x: 0, y: -190},     // Top Tip
    {x: 45, y: -150},
    {x: 100, y: -110},   // Upper right flick
    {x: 80, y: -60},
    {x: 145, y: -15},    // Mid right wing
    {x: 165, y: 55},
    {x: 140, y: 130},    // Lower right bulb
    {x: 85, y: 185},
    {x: 0, y: 200},      // Bottom center
    {x: -85, y: 185},
    {x: -140, y: 130},   // Lower left bulb
    {x: -165, y: 55},
    {x: -145, y: -15},   // Mid left wing
    {x: -80, y: -60},
    {x: -100, y: -110},  // Upper left flick
    {x: -45, y: -150}
  ];

  const centerX = 240;
  const centerY = 240;

  flamePoints.forEach((pt, i) => {
    const card = document.createElement('div');
    card.className = 'flame-photo-card';
    card.style.left = `${centerX + pt.x - 36}px`;
    card.style.top = `${centerY + pt.y - 36}px`;
    
    // Dito ilalagay ang image link mula sa array sa itaas:
    const imagePath = myPhotos[i] || `https://picsum.photos/seed/flamephoto${i + 10}/200/200`;
    card.innerHTML = `<img src="${imagePath}" alt="Streak photo ${i+1}">`;
    container.appendChild(card);

    setTimeout(() => {
      card.classList.add('revealed');
      card.style.transform = `scale(1) rotate(${(Math.random() - 0.5) * 15}deg)`;
    }, i * 65);
  });

  const centerBadge = document.getElementById('center-badge');
  setTimeout(() => {
    centerBadge.classList.add('revealed');
  }, flamePoints.length * 65 + 100);
}

    // ================= FIREWORKS ENGINE =================
    function startFireworks() {
      const fCanvas = document.getElementById('fireworks-canvas');
      const fCtx = fCanvas.getContext('2d');
      fCanvas.width = window.innerWidth;
      fCanvas.height = window.innerHeight;

      let particles = [];
      const colors = ['#ff1493', '#ec4899', '#a855f7', '#38bdf8', '#ffdf00', '#ffffff'];

      function spawnFirework(x, y) {
        const count = 35;
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 5 + 1;
          particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            radius: Math.random() * 2 + 1
          });
        }
      }

      setInterval(() => {
        const isLeft = Math.random() > 0.5;
        const x = isLeft ? Math.random() * (fCanvas.width * 0.25) : fCanvas.width - Math.random() * (fCanvas.width * 0.25);
        const y = Math.random() * (fCanvas.height * 0.7) + 50;
        spawnFirework(x, y);
      }, 500);

      function loopFireworks() {
        fCtx.clearRect(0, 0, fCanvas.width, fCanvas.height);

        particles.forEach((p, index) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.04;
          p.alpha -= 0.015;

          if (p.alpha <= 0) {
            particles.splice(index, 1);
          } else {
            fCtx.beginPath();
            fCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            fCtx.fillStyle = p.color;
            fCtx.globalAlpha = p.alpha;
            fCtx.shadowBlur = 10;
            fCtx.shadowColor = p.color;
            fCtx.fill();
            fCtx.globalAlpha = 1;
          }
        });

        requestAnimationFrame(loopFireworks);
      }
      loopFireworks();
    }

    // ================= SEQUENCE CONTROLLER =================
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        const loader = document.getElementById('loader-screen');
        const countdownScreen = document.getElementById('countdown-screen');
        const countText = document.getElementById('countdown-number');
        const celebrationScreen = document.getElementById('celebration-screen');
        const letterScreen = document.getElementById('interactive-letter-screen');

        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.visibility = 'hidden';
          countdownScreen.style.visibility = 'visible';
          countdownScreen.style.opacity = '1';
          startMatrix();

          let count = 3;
          playAudioFx(520, 0.2);
          countText.innerText = count;

          const countTimer = setInterval(() => {
            count--;
            if (count > 0) {
              countText.style.animation = 'none';
              void countText.offsetWidth;
              countText.style.animation = 'popIn 0.8s ease forwards';
              countText.innerText = count;
              playAudioFx(520 + (3 - count) * 100, 0.2);
            } else {
              clearInterval(countTimer);
              clearInterval(matrixInterval);
              playAudioFx(1046, 0.4);

              countdownScreen.style.opacity = '0';
              setTimeout(() => {
                countdownScreen.style.visibility = 'hidden';
                celebrationScreen.style.visibility = 'visible';
                celebrationScreen.style.opacity = '1';

                setTimeout(() => {
                  celebrationScreen.style.opacity = '0';
                  setTimeout(() => {
                    celebrationScreen.style.visibility = 'hidden';
                    letterScreen.style.visibility = 'visible';
                    letterScreen.style.opacity = '1';
                  }, 500);
                }, 2500);

              }, 400);
            }
          }, 1000);
        }, 600);
      }, 2500);
    });
