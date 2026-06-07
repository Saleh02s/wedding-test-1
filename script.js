/* =================================================================
   ╔══════════════════════════════════════════════════════════════╗
   ║   EDIT EVERYTHING HERE — ULKAR & FUAD WEDDING                  ║
   ║   This is the ONE place to change names, date, venue,         ║
   ║   address, map links, times, story and agenda.                ║
   ╚══════════════════════════════════════════════════════════════╝
   ================================================================= */

const CONFIG = {
  /* --- Couple --- */
  coupleNames: "Ulkar & Fuad",
  coupleShort: "U & F",          // logo + curtain initials

  /* --- Wedding date & time ---
     Format: "YYYY-MM-DDTHH:MM:SS"  (24-hour clock, local time)
     This single value powers the countdown timer. */
  weddingDateTime: "2026-09-06T17:00:00",

  /* Pretty display strings (edit freely, purely cosmetic) */
  displayDateLong:  "Sunday, the 6th of September, 2026",
  displayDateShort: "06.09.2026",
  displayMonthDay:  "September 6, 2026",
  displayTime:      "17:00",

  /* --- Venue / location --- */
  venueName: "Venue Name Placeholder",
  city:      "City, Country",
  address:   "Street Address Placeholder, City, Country",

  /* --- Map links (replace with your real links) --- */
  // Google Maps embed: open maps.google.com -> Share -> Embed a map -> copy the src URL here.
  mapEmbedUrl:    "https://www.google.com/maps?q=Baku,Azerbaijan&output=embed",
  // Plain Google Maps link (opens the app / browser):
  googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Baku,Azerbaijan",
  // Waze deep link:
  wazeLink:       "https://waze.com/ul?q=Baku,Azerbaijan",

  /* --- Arrival & schedule times --- */
  guestArrivalTime: "16:30",
  ceremonyTime:     "17:00",
  dinnerTime:       "18:30",

  /* --- Our Story (3 blocks) --- */
  story: [
    {
      title: "Test",
      text:  "Placeholder story text. Replace this with the lovely story of how Ulkar and Fuad first met.",
      photo: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Test",
      text:  "Placeholder story text. Replace this with a sweet memory or milestone from their journey together.",
      photo: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Test",
      text:  "Placeholder story text. Replace this with the moment of the proposal or another cherished chapter.",
      photo: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
    },
  ],

  /* --- Wedding agenda / timeline --- */
  agenda: [
    { time: "16:30", title: "Guest Arrival" },
    { time: "17:00", title: "Ceremony" },
    { time: "17:45", title: "Photoshoot" },
    { time: "18:30", title: "Dinner" },
    { time: "20:00", title: "First Dance" },
    { time: "20:30", title: "Celebration" },
  ],
};

/* =================================================================
   ↓↓↓  No need to edit below this line for normal changes  ↓↓↓
   ================================================================= */

/* ---- Curtain opening ---- */
const curtainScreen = document.getElementById("curtainScreen");
const openBtn        = document.getElementById("openBtn");
const header         = document.getElementById("siteHeader");
const invitation     = document.getElementById("invitation");

/* ---- Full-screen opening video (transparent curtains) ---- */
/* The green screen is already keyed out and baked into the video files, so a
   plain <video> reveals the page through the curtains — no WebGL needed, which
   means it also works when the file is opened directly (file://).
   WebM (VP9 alpha) covers Chrome/Firefox/Edge; HEVC-alpha MP4 covers Safari. */
const curtainVideo = document.getElementById("curtainVideo");
const curtainFallback = document.getElementById("curtainFallback");

const isSafari = /^((?!chrome|android|crios|fxios|edg).)*safari/i.test(navigator.userAgent);
const useWebm = !isSafari && curtainVideo.canPlayType('video/webm; codecs="vp9"') !== "";
// WebM/VP9 alpha → Chrome/Firefox/Edge/Android; HEVC-alpha .mov → Safari/iOS.
curtainVideo.src = (useWebm ? "assets/curtain.webm" : "assets/curtain-alpha.mov") + "#t=0.001";

let curtainOpened = false;
let curtainFinished = false;
let videoStarted = false;   // becomes true once the video actually paints frames
let fallbackUsed = false;   // CSS curtain animation has taken over

// Lock scrolling until the curtains have opened.
document.documentElement.classList.add("curtain-locked");
document.body.classList.add("curtain-locked");

// Once the curtains are open, keep them frozen on their final (open) frame over
// just the first screen, and re-enable scrolling. We don't wait for the whole
// video to finish — this fires as soon as the curtains are essentially open.
function finishCurtains() {
  if (curtainFinished) return;
  curtainFinished = true;
  curtainScreen.classList.add("done"); // pointer-events: none, curtains stay visible
  document.documentElement.classList.remove("curtain-locked");
  document.body.classList.remove("curtain-locked");
}

// Track real playback: once the video paints frames, currentTime advances.
function onVideoProgress() {
  if (curtainVideo.currentTime > 0.05) {
    videoStarted = true;
    if (curtainVideo.currentTime >= 2.5) finishCurtains();
  }
}

// Image-based curtains that part open — used when the transparent video can't
// be decoded (common on phones). Looks the same since it uses the poster frame.
function runFallback() {
  if (videoStarted || fallbackUsed) return;
  fallbackUsed = true;

  curtainVideo.style.display = "none";        // drop the stuck video/poster
  if (!curtainFallback) { finishCurtains(); return; }

  curtainFallback.classList.add("show");
  // force a reflow, then on the next frames slide the two halves apart
  void curtainFallback.offsetWidth;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => curtainFallback.classList.add("part"))
  );

  setTimeout(finishCurtains, 1500);
}

function openCurtains() {
  if (curtainOpened) return;          // run only once
  curtainOpened = true;

  // reveal the wedding page so it shows through the parting curtains
  invitation.classList.add("revealed");
  header.classList.add("visible");
  curtainScreen.classList.add("open"); // hides the start-screen text

  curtainVideo.currentTime = 0;
  const p = curtainVideo.play();
  if (p && p.catch) p.catch(runFallback); // playback blocked/unsupported → CSS curtains

  // Unlock 2.5s into the video, instead of waiting for it to play out.
  curtainVideo.addEventListener("timeupdate", onVideoProgress);
  curtainVideo.addEventListener("ended", finishCurtains, { once: true }); // fallback

  // If the video hasn't actually begun painting frames shortly after the tap
  // (e.g. a phone that can't decode the transparent video), part the CSS curtains.
  setTimeout(() => { if (!videoStarted) runFallback(); }, 1100);
}

// start via the button …
openBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  openCurtains();
});

// … or by clicking/tapping anywhere on the overlay
curtainScreen.addEventListener("click", openCurtains);

/* ---- Populate content from CONFIG ---- */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function populate() {
  setText("logoInitials", CONFIG.coupleShort);
  setText("logoDate",     CONFIG.displayDateShort);

  setText("heroNames", CONFIG.coupleNames);
  setText("heroDate",  CONFIG.displayDateLong);

  setText("detailWhen",  CONFIG.displayMonthDay);
  setText("detailVenue", CONFIG.venueName);
  setText("detailCity",  CONFIG.city);
  setText("detailTime",  CONFIG.displayTime);

  setText("locVenue",   CONFIG.venueName);
  setText("locAddress", CONFIG.address);

  setText("arriveGuests",   CONFIG.guestArrivalTime);
  setText("arriveCeremony", CONFIG.ceremonyTime);
  setText("arriveDinner",   CONFIG.dinnerTime);

  setText("footerNames", CONFIG.coupleNames);
  setText("footerDate",  CONFIG.displayDateShort);

  // Map links
  const mapEmbed = document.getElementById("mapEmbed");
  if (mapEmbed) mapEmbed.src = CONFIG.mapEmbedUrl;
  const gBtn = document.getElementById("googleMapsBtn");
  if (gBtn) gBtn.href = CONFIG.googleMapsLink;
  const wBtn = document.getElementById("wazeBtn");
  if (wBtn) wBtn.href = CONFIG.wazeLink;

  // Story blocks
  const storyWrap = document.getElementById("storyBlocks");
  if (storyWrap) {
    storyWrap.innerHTML = CONFIG.story.map((s, i) => `
      <article class="story-block">
        <div class="story-photo">
          <div class="frame-media">
            <img src="${s.photo}" alt="${s.title}" loading="lazy" />
          </div>
        </div>
        <div class="story-text">
          <p class="story-num">Chapter ${String(i + 1).padStart(2, "0")}</p>
          <h3>${s.title}</h3>
          <p>${s.text}</p>
        </div>
      </article>
    `).join("");
  }

  // Agenda / timeline
  const timeline = document.getElementById("timeline");
  if (timeline) {
    timeline.innerHTML = CONFIG.agenda.map(a => `
      <div class="tl-item">
        <div class="tl-time">${a.time}</div>
        <div class="tl-title">${a.title}</div>
      </div>
    `).join("");
  }
}

/* ---- Wishes from guests (stored locally in the browser) ---- */
const WISHES_KEY = "uf_wishes";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function loadWishes() {
  try {
    const raw = localStorage.getItem(WISHES_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function saveWishes(wishes) {
  try {
    localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));
  } catch (e) {
    /* storage may be unavailable (private mode) — wishes just won't persist */
  }
}

function formatWishDate(ts) {
  try {
    return new Date(ts).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return "";
  }
}

function renderWishes() {
  const list = document.getElementById("wishesList");
  if (!list) return;
  const wishes = loadWishes();

  if (!wishes.length) {
    list.innerHTML =
      '<p class="wishes-empty">Be the first to leave a wish for the couple.</p>';
    return;
  }

  // newest first
  list.innerHTML = wishes
    .slice()
    .reverse()
    .map(
      (w) => `
      <article class="wish-card">
        <p class="wish-quote">${escapeHtml(w.message)}</p>
        <div class="wish-meta">
          <span class="wish-author">${escapeHtml(w.name)}</span>
          <span class="wish-date">${formatWishDate(w.date)}</span>
        </div>
      </article>`
    )
    .join("");
}

function setupWishes() {
  const form = document.getElementById("wishForm");
  if (!form) return;
  const nameEl = document.getElementById("wishName");
  const msgEl = document.getElementById("wishMessage");

  renderWishes();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (nameEl.value || "").trim();
    const message = (msgEl.value || "").trim();
    if (!name || !message) {
      (!name ? nameEl : msgEl).focus();
      return;
    }

    const wishes = loadWishes();
    wishes.push({ name, message, date: Date.now() });
    saveWishes(wishes);

    form.reset();
    renderWishes();

    // bring the freshly added wish into view
    const first = document.querySelector("#wishesList .wish-card");
    if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* ---- Countdown timer ---- */
function startCountdown() {
  const target = new Date(CONFIG.weddingDateTime).getTime();

  function tick() {
    const now = Date.now();
    let diff = target - now;
    if (diff < 0) diff = 0;

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    setText("cdDays",    String(days).padStart(2, "0"));
    setText("cdHours",   String(hours).padStart(2, "0"));
    setText("cdMinutes", String(minutes).padStart(2, "0"));
    setText("cdSeconds", String(seconds).padStart(2, "0"));
  }

  tick();
  setInterval(tick, 1000);
}

/* ---- Scroll reveal on sections ---- */
function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in-view");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(i => obs.observe(i));
}

/* ---- Header background on scroll ---- */
function setupHeaderScroll() {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  });
}

/* ---- Language selector (visual only for now) ---- */
function setupLangSelector() {
  const buttons = document.querySelectorAll(".lang-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      // Translation hook for later:
      // const lang = btn.dataset.lang;  // "aze" | "rus" | "eng"
    });
  });
}

/* ---- Init ---- */
document.addEventListener("DOMContentLoaded", () => {
  populate();
  startCountdown();
  setupReveal();
  setupHeaderScroll();
  setupLangSelector();
  setupWishes();
  if (location.hash === "#open") openCurtains();
});
