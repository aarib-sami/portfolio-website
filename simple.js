const DEMOS = {
  fireguard: "./assets/FireGuardAI/fireguard-ai.mp4",
  policycompass: "./assets/Policy-Compass/policy-compass.mp4",
  gryph: "./assets/Gryph-Course-Watch/gryph-course-watch.mp4",
  faceid: "./assets/AI-FaceID-Attendance-System/AI-FaceID-Attendance-System.mp4",
  alpine: "./assets/Alpine-Escape/Alpine-Escape.mp4",
  aid: "./assets/Humanitarian-Aid-Service/Humanitarian Aid Service.mp4",
};

function setDemoParam(value) {
  const url = new URL(window.location.href);
  if (value) url.searchParams.set("demo", value);
  else url.searchParams.delete("demo");
  window.history.replaceState({}, "", url);
}

function openVideo(src, demoKey) {
  const modal = document.getElementById("videoModal");
  const player = document.getElementById("videoPlayer");
  if (!modal || !player) return;

  const sourceEl = player.querySelector("source");
  if (!sourceEl) return;

  sourceEl.src = src;
  player.load();

  // Autoplay policy: start muted, user can unmute.
  player.muted = true;
  player.playsInline = true;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  if (demoKey) setDemoParam(demoKey);

  // Try autoplay; if blocked, controls still show.
  const p = player.play();
  if (p && typeof p.catch === "function") p.catch(() => {});
}

function closeVideo() {
  const modal = document.getElementById("videoModal");
  const player = document.getElementById("videoPlayer");
  if (!modal || !player) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");

  try {
    player.pause();
    player.currentTime = 0;
  } catch (_) {}

  const sourceEl = player.querySelector("source");
  if (sourceEl) sourceEl.src = "";

  setDemoParam(null);
}

function bootDeepLink() {
  const demoKey = new URLSearchParams(window.location.search).get("demo");
  if (!demoKey) return;

  const src = DEMOS[demoKey];
  if (!src) return;

  openVideo(src, demoKey);
}

document.addEventListener("DOMContentLoaded", () => {
  // Intercept demo links so they open modal but remain shareable.
  document.querySelectorAll('a[href^="?demo="]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";
      const demoKey = new URLSearchParams(href.slice(1)).get("demo");
      const src = demoKey ? DEMOS[demoKey] : null;
      if (!src) return;
      e.preventDefault();
      openVideo(src, demoKey);
    });
  });

  const closeBtn = document.getElementById("videoClose");
  if (closeBtn) closeBtn.addEventListener("click", closeVideo);

  const modal = document.getElementById("videoModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      // Close when clicking backdrop (outside card).
      if (e.target === modal) closeVideo();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeVideo();
  });

  bootDeepLink();
});

/* ---------------- cinematography reels ----------------
 * Instagram reel links, newest first.
 */
const REELS = [
  "https://www.instagram.com/reel/Df6AvIMSh82/", // Nov 19, 2026
  "https://www.instagram.com/reel/DfJePvWy_1j/", // Oct 31, 2026
  "https://www.instagram.com/reel/DfBFb6btxyT/", // Oct 27, 2026
  "https://www.instagram.com/reel/Dex6DANN26C/", // Oct 22, 2026
];

/* Longer videos (YouTube / Vimeo links, or mp4s in ./assets/Videos). */
const VIDEOS = [];

/* Photos: drop files in ./assets/Photos and list them here.
 *   { src: "./assets/Photos/algonquin.jpg", alt: "fog over algonquin" } */
const PHOTOS = [];

// Hide a reels/videos/pictures group when it has nothing in it yet.
function toggleGroup(id, hasItems) {
  const g = document.getElementById(id);
  if (g) g.hidden = !hasItems;
}

// Defer loading embeds until the grid is near the viewport.
function lazyLoadFrames(grid) {
  const load = () =>
    grid.querySelectorAll("[data-src]").forEach((f) => {
      f.src = f.dataset.src;
      f.removeAttribute("data-src");
    });
  if (!("IntersectionObserver" in window)) return load();
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        load();
        io.disconnect();
      }
    },
    { rootMargin: "400px" }
  );
  io.observe(grid);
}

function renderVideos() {
  const grid = document.getElementById("videos");
  toggleGroup("videos-group", VIDEOS.length > 0);
  if (!grid || !VIDEOS.length) return;

  VIDEOS.forEach((url) => {
    const tile = document.createElement("div");
    tile.className = "video-tile";
    let m;
    if (/\.(mp4|webm|mov)$/i.test(url)) {
      const v = document.createElement("video");
      v.src = url;
      v.controls = true;
      v.preload = "metadata";
      v.playsInline = true;
      tile.appendChild(v);
    } else {
      let src = null;
      if ((m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)))
        src = `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0`;
      else if ((m = url.match(/vimeo\.com\/(\d+)/)))
        src = `https://player.vimeo.com/video/${m[1]}?dnt=1`;
      if (!src) return;
      const f = document.createElement("iframe");
      f.dataset.src = src;
      f.title = "video";
      f.allow = "encrypted-media; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      tile.appendChild(f);
    }
    grid.appendChild(tile);
  });
  lazyLoadFrames(grid);
}

function renderPhotos() {
  const grid = document.getElementById("photos");
  toggleGroup("photos-group", PHOTOS.length > 0);
  if (!grid || !PHOTOS.length) return;

  const modal = document.getElementById("photoModal");
  const full = document.getElementById("photoFull");
  const close = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    full.removeAttribute("src");
  };

  PHOTOS.forEach(({ src, alt = "" }) => {
    const btn = document.createElement("button");
    btn.className = "photo";
    btn.setAttribute("aria-label", alt ? `view ${alt}` : "view photo");
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";
    btn.appendChild(img);
    btn.addEventListener("click", () => {
      full.src = src;
      full.alt = alt;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    });
    grid.appendChild(btn);
  });

  document.getElementById("photoClose").addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) close();
  });
}

function renderReels() {
  const grid = document.getElementById("reels");
  toggleGroup("reels-group", REELS.length > 0);
  if (!grid) return;

  REELS.forEach((url) => {
    const m = url.match(/instagram\.com\/(?:reels?|p)\/([\w-]+)/);
    if (!m) return;
    const tile = document.createElement("div");
    tile.className = "reel";
    const frame = document.createElement("iframe");
    frame.dataset.src = `https://www.instagram.com/reel/${m[1]}/embed/`;
    frame.title = "cinematography reel";
    frame.loading = "lazy";
    frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    frame.setAttribute("scrolling", "no");
    tile.appendChild(frame);
    grid.appendChild(tile);
  });

  lazyLoadFrames(grid);
}

document.addEventListener("DOMContentLoaded", () => {
  renderReels();
  renderVideos();
  renderPhotos();
});

/* previous experience toggle (next to the "experience" heading) */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".exp-toggle");
  const list = document.getElementById("prev-exp");
  if (!btn || !list) return;
  const label = btn.querySelector(".exp-toggle-label");
  const count = list.querySelectorAll(":scope > .item").length;
  const render = (open) => {
    btn.setAttribute("aria-expanded", String(open));
    list.hidden = !open;
    // Opening "previous" expands every role so the details are visible at once.
    list.querySelectorAll("details.item").forEach((d) => (d.open = open));
    label.textContent = open ? "− hide previous" : `+ ${count} previous`;
  };
  render(false);
  btn.addEventListener("click", () => render(list.hidden));
});
