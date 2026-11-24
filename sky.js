/* Night sky background: slowly rotating star trails + falling snow.
 * Both canvases sit behind the page content. Respects reduced motion. */
(() => {
  const sky = document.getElementById("sky");
  const snow = document.getElementById("snow");
  if (!sky || !snow) return;

  const sctx = sky.getContext("2d");
  const nctx = snow.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  const STAR_COUNT = 170;
  const SPIN = (2 * Math.PI) / (15 * 60); // one full turn every 15 min
  const MAX_TRAIL = (14 * Math.PI) / 180; // trails grow to 14°
  const TRAIL_SEGMENTS = 6;

  let w = 0, h = 0, dpr = 1, pole = { x: 0, y: 0 }, maxR = 0;
  let stars = [], flakes = [];

  // Deterministic random so the sky looks the same each visit.
  let seed = 11;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  function size(canvas, ctx) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function setup() {
    w = window.innerWidth;
    h = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    size(sky, sctx);
    size(snow, nctx);

    // Celestial pole up and to the left; stars wheel around it.
    pole = { x: w * 0.3, y: h * 0.16 };
    maxR = Math.hypot(Math.max(pole.x, w - pole.x), Math.max(pole.y, h - pole.y));

    seed = 11;
    stars = Array.from({ length: STAR_COUNT }, () => {
      const bright = rand() < 0.07;
      return {
        r: Math.sqrt(rand()) * maxR, // even spread over the disc
        a: rand() * Math.PI * 2,
        size: bright ? 1.3 : 0.45 + rand() * 0.55,
        alpha: bright ? 0.85 : 0.25 + rand() * 0.45,
      };
    });

    const count = Math.round(Math.min(110, (w * h) / 14000));
    flakes = Array.from({ length: count }, () => newFlake(true));
  }

  function newFlake(anywhere) {
    const depth = Math.random(); // 0 = far, 1 = near
    return {
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -10,
      r: 0.6 + depth * 1.6,
      vy: 10 + depth * 28, // px per second
      sway: 6 + Math.random() * 14,
      phase: Math.random() * Math.PI * 2,
      freq: 0.3 + Math.random() * 0.5,
      alpha: 0.25 + depth * 0.45,
    };
  }

  // Fade stars toward the horizon so they sink behind the ridgelines.
  const horizonFade = (y) => Math.max(0, Math.min(1, 1.15 - y / (h * 0.85)));

  function drawSky(t) {
    sctx.clearRect(0, 0, w, h);
    const rot = SPIN * t;
    const trail = Math.min(rot, MAX_TRAIL);
    sctx.lineCap = "round";

    for (const s of stars) {
      const a = s.a + rot;
      const hx = pole.x + Math.cos(a) * s.r;
      const hy = pole.y + Math.sin(a) * s.r;
      const fade = horizonFade(hy);
      if (fade <= 0 && horizonFade(pole.y + Math.sin(a - trail) * s.r) <= 0) continue;

      // Trail: arc segments that get fainter the further back they are.
      if (trail > 0.002 && s.r > 2) {
        sctx.lineWidth = s.size * 1.1;
        for (let k = 0; k < TRAIL_SEGMENTS; k++) {
          const a1 = a - (trail * k) / TRAIL_SEGMENTS;
          const a0 = a - (trail * (k + 1)) / TRAIL_SEGMENTS;
          const my = pole.y + Math.sin((a0 + a1) / 2) * s.r;
          const al = s.alpha * 0.55 * (1 - k / TRAIL_SEGMENTS) * horizonFade(my);
          if (al <= 0.01) continue;
          sctx.strokeStyle = `rgba(233, 239, 233, ${al})`;
          sctx.beginPath();
          sctx.arc(pole.x, pole.y, s.r, a0, a1);
          sctx.stroke();
        }
      }

      // Star head
      if (fade > 0) {
        sctx.fillStyle = `rgba(240, 244, 238, ${s.alpha * fade})`;
        sctx.beginPath();
        sctx.arc(hx, hy, s.size, 0, Math.PI * 2);
        sctx.fill();
      }
    }
  }

  function drawSnow(t, dt) {
    nctx.clearRect(0, 0, w, h);
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.y += f.vy * dt;
      const x = f.x + Math.sin(t * f.freq + f.phase) * f.sway;
      if (f.y > h + 10) {
        flakes[i] = newFlake(false);
        continue;
      }
      nctx.fillStyle = `rgba(245, 248, 245, ${f.alpha})`;
      nctx.beginPath();
      nctx.arc(x, f.y, f.r, 0, Math.PI * 2);
      nctx.fill();
    }
  }

  let start = null, last = null, raf = null;

  function frame(now) {
    if (start === null) start = last = now;
    const t = (now - start) / 1000;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    drawSky(t);
    drawSnow(t, dt);
    raf = requestAnimationFrame(frame);
  }

  function run() {
    cancelAnimationFrame(raf);
    setup();
    if (reduce.matches) {
      // Still sky, a light dusting of stationary snow.
      drawSky(0);
      drawSnow(0, 0);
      return;
    }
    start = null;
    raf = requestAnimationFrame(frame);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Keep elapsed time so trails don't reset on resize.
      const keep = start;
      setup();
      if (reduce.matches) {
        drawSky(0);
        drawSnow(0, 0);
      } else if (keep === null) run();
    }, 150);
  });
  reduce.addEventListener?.("change", run);

  run();
})();
