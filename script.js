/* script.js
   Adds:
   - Balloons creation + gentle animation
   - Confetti particle effect on canvas
   - Wish button sparkle + typing message effect
   - Reset behavior
*/

(() => {
  // Elements
  const msgEl = document.getElementById('message');
  const wishBtn = document.getElementById('wishBtn');
  const confettiBtn = document.getElementById('confettiBtn');
  const resetBtn = document.getElementById('resetBtn');
  const balloonsRoot = document.getElementById('balloons');
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');

  // Message text to type out
  const birthdayMessage = "May your day sparkle with laughter, your year overflow with joy, and every wish find its wings. Happy Birthday! 🎂💙";

  // ---------- Responsive canvas ----------
  function resizeCanvas(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // ---------- Confetti ----------
  const confettiPieces = [];
  const colors = ["#ffd166", "#ff7ab6", "#a5d8ff", "#ffffff", "#4cc9f0", "#c4f0c6"];

  function spawnConfetti(x, y, spread = 200, count = 40){
    for(let i=0;i<count;i++){
      confettiPieces.push({
        x: x + (Math.random()-0.5)*spread,
        y: y + (Math.random()-0.5)*spread/2,
        vx: (Math.random()-0.5) * 6,
        vy: (Math.random()*-6) - 2,
        size: 6 + Math.random()*8,
        tilt: Math.random()*Math.PI,
        color: colors[Math.floor(Math.random()*colors.length)],
        spin: (Math.random()-0.5)*0.25,
        life: 80 + Math.random()*60
      });
    }
  }

  function updateConfetti(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=confettiPieces.length-1;i>=0;i--){
      const p = confettiPieces[i];
      p.vy += 0.12; // gravity
      p.vx *= 0.995; // air resistance
      p.x += p.vx;
      p.y += p.vy;
      p.tilt += p.spin;
      p.life--;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.tilt);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
      ctx.restore();
      if (p.y > canvas.height + 60 || p.x < -100 || p.x > canvas.width + 100 || p.life < 0) confettiPieces.splice(i,1);
    }
    requestAnimationFrame(updateConfetti);
  }
  updateConfetti();

  // ---------- Balloons ----------
  const balloonTypes = ['blue','navy','whiteish'];
  function createBalloon(index){
    const el = document.createElement('div');
    el.className = `balloon ${balloonTypes[index % balloonTypes.length]}`;
    const duration = 8 + Math.random()*6;
    el.style.setProperty('--duration', `${duration}s`);
    // random horizontal start
    const leftPct = 12 + Math.random()*76;
    el.style.left = `${leftPct}%`;
    el.style.bottom = `${-20 - Math.random()*40}px`;
    // size variation
    const scale = 0.9 + Math.random()*0.7;
    el.style.transform = `scale(${scale})`;
    // shine
    const shine = document.createElement('span');
    shine.className = 'shine';
    el.appendChild(shine);
    balloonsRoot.appendChild(el);

    // gentle horizontal sway using Web Animations API (sync with CSS float)
    el.animate([
      { transform: `translateY(0) rotate(${(-8 + Math.random()*16).toFixed(1)}deg) scale(${scale})` },
      { transform: `translateY(-60px) rotate(${(-4 + Math.random()*8).toFixed(1)}deg) scale(${scale})` },
      { transform: `translateY(0) rotate(${(-8 + Math.random()*16).toFixed(1)}deg) scale(${scale})` }
    ], {
      duration: 2400 + Math.random()*2400,
      iterations: Infinity,
      direction: 'alternate',
      easing: 'ease-in-out'
    });

    // remove after animation time (so new ones can spawn)
    setTimeout(()=> {
      el.remove();
    }, (8 + Math.random()*6) * 1000 + 2000);
  }

  function spawnBalloons(count = 6){
    for(let i=0;i<count;i++){
      setTimeout(()=> createBalloon(i), i * 300);
    }
  }

  // spawn a few initially
  spawnBalloons(5);

  // ---------- Typing effect ----------
  function typeMessage(text, targetEl, speed = 34){
    targetEl.textContent = '';
    let i=0;
    const ticker = setInterval(()=>{
      targetEl.textContent += text[i] || '';
      i++;
      if(i >= text.length) clearInterval(ticker);
    }, speed);
  }

  // initial gentler type
  typeMessage("Click ✨ Make a Wish ✨ and let's celebrate!", msgEl, 28);

  // ---------- Button handlers ----------
  wishBtn.addEventListener('click', async () => {
    // visual press
    wishBtn.animate([
      { transform: 'scale(1)'},
      { transform: 'scale(1.06)'},
      { transform: 'scale(1)' }
    ], {duration: 380, easing: 'cubic-bezier(.2,.9,.3,1)'});

    // toggle aria
    const pressed = wishBtn.getAttribute('aria-pressed') === 'true';
    wishBtn.setAttribute('aria-pressed', String(!pressed));

    // spawn confetti from center
    spawnConfetti(innerWidth/2, innerHeight/3, 320, 80);

    // spawn balloons
    spawnBalloons(8);

    // typing the message
    typeMessage(birthdayMessage, msgEl, 32);

    // tiny sparkle ring animation around button
    const ring = document.createElement('span');
    ring.style.position='absolute';
    ring.style.left='50%';
    ring.style.top='50%';
    ring.style.transform='translate(-50%,-50%)';
    ring.style.width='220px';
    ring.style.height='220px';
    ring.style.borderRadius='50%';
    ring.style.boxShadow=`0 0 60px 20px rgba(255,209,102,0.06), 0 0 30px 6px rgba(165,216,255,0.04)`;
    ring.style.pointerEvents='none';
    ring.style.zIndex='2';
    wishBtn.appendChild(ring);
    setTimeout(()=> ring.remove(), 900);

    // play a short gentle chime (WebAudio)
    playChime();
  });

  confettiBtn.addEventListener('click', (e) => {
    // spawn confetti at button coords
    const rect = e.currentTarget.getBoundingClientRect();
    spawnConfetti(rect.left + rect.width/2, rect.top, 240, 60);
    // a few balloons
    spawnBalloons(4);
  });

  resetBtn.addEventListener('click', () => {
    // clear confetti array
    confettiPieces.length = 0;
    // clear message
    msgEl.textContent = '';
    typeMessage("Click ✨ Make a Wish ✨ and let's celebrate!", msgEl, 18);
  });

  // ---------- Audio chime using WebAudio ----------
  function playChime(){
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(480, now);
      o.frequency.exponentialRampToValueAtTime(660, now + 0.28);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.12, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(now);
      o.stop(now + 1.45);
    } catch (err){
      // audio may be blocked on some browsers; silently ignore
      console.warn("Audio not available:", err && err.message);
    }
  }

  // ---------- Nice tiny hint: press space to trigger confetti ----------
  addEventListener('keydown', (e) => {
    if(e.code === 'Space'){
      e.preventDefault();
      spawnConfetti(innerWidth/2, innerHeight/2, 400, 80);
      spawnBalloons(3);
    }
  });

})();
