const DEMOS = {
  fireguard: "./assets/FireGuardAI/fireguard-ai.mp4",
  policycompass: "./assets/Policy-Compass/policy-compass.mp4",
  gryph: "./assets/Gryph-Course-Watch/gryph-course-watch.mp4",
  faceid: "./assets/AI-FaceID-Attendance-System/AI-FaceID-Attendance-System.mp4",
  contactlist: "./assets/Contact-List-Organizer/contact-list-organizer.mp4",
  zoo: "./assets/Zoo-Animal-Classifier/Zoo-Animal-Classifier.mp4",
  carbase: "./assets/Carbase/CarBase.mp4",
  alpine: "./assets/Alpine-Escape/Alpine-Escape.mp4",
  aid: "./assets/Humanitarian-Aid-Service/Humanitarian Aid Service.mp4",
  lazer: "./assets/Lazer-Defender/Lazer Defender.mp4",
  glitch: "./assets/Glitch-Garden/Glitch Garden.mp4",
  icicle: "./assets/Catch-The-Icicle/Catch The Icicle.mp4",
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
