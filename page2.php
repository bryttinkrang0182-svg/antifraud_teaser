<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Victim Count</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="styles.css" />
  
  <!-- Preload heavy side images for instant rendering -->
  <link rel="preload" href="images/benz.png" as="image">
  <link rel="preload" href="images/wagadri_man.png" as="image">
  <link rel="preload" href="images/ECOBANK_WRONG_LOGO.png" as="image">
</head>
<body>
  
<section id="page2" class="page active">

<nav class="top-nav" aria-label="Main navigation">
    <button class="hamburger" aria-label="Toggle menu" id="menuToggle">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.php">Home</a></li>
      <li><a href="page2.php">About</a></li>
      <li><a href="#">Safety</a></li>
      <li><a href="#">Report</a></li>
    </ul>
  </nav>

  <img src="images/ECOBANK_WRONG_LOGO.png" alt="Logo" class="page-logo">
  <div class="side-wrap">
    <img src="images/benz.png" alt="Car" class="side-image left">
    <img src="images/wagadri_man.png" alt="Man" class="side-image right">
  </div>

  <div class="count-wrap">

    <p style="font-weight: 700; font-size: clamp(3.5rem, 15vw, 12rem);" id="victimTitle">Welcome</p>
    <p style="font-weight: 500; font-size: clamp(1.5rem, 5vw, 3rem);" id="victimSub">Victim No.</p>
    <p id="victimName" class="victim-name"></p>

    <div class="tiles" id="victimTiles" aria-hidden="false"></div>

    <div class="count-actions"></div>
  </div>
</section>

<div id="loaderOverlay" class="loader-overlay" aria-hidden="true">
  <div class="loader-inner">
    <svg class="loader-svg" viewBox="0 0 50 50" width="64" height="64" aria-hidden="true">
      <circle class="loader-ring" cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
    </svg>
    <div class="loader-text">Loading…</div>
  </div>
</div>

<!-- Timed notice overlay (appears after configured delay) -->
<div id="noticeOverlay" class="notice-overlay" role="dialog" aria-hidden="true" aria-live="polite">
  <div id="noticeMsg" class="notice-msg" aria-hidden="true"></div>
</div>

<script src="script.js"></script>
<script>
// On this standalone page, fetch count and render
document.addEventListener('DOMContentLoaded', function () {
  const loader = document.getElementById('loaderOverlay');
  if (loader) loader.classList.add('show');
  fetch('submit.php?action=count')
    .then(r => r.json())
    .then(data => {
      if (data && data.success) {
        const cnt = Number(data.count) || 0;
        const start = cnt > 0 ? cnt - 1 : 0;
        renderVictimTiles(start, cnt);
      }
    })
    .catch(err => console.error('Failed to fetch count', err))
    .finally(() => {
      if (loader) setTimeout(() => loader.classList.remove('show'), 300);
      
      // Start the 5-second notice timer only AFTER the loader hides and data is ready
      if (typeof window.startNoticeTimer === 'function') {
        window.startNoticeTimer();
      }
    });
});
</script>
<script>
// Timed notice flow for page2 — 30 seconds, push counter up, then show overlay
(function () {
  const overlay = document.getElementById('noticeOverlay');
  const msg = document.getElementById('noticeMsg');
  const countWrap = document.querySelector('#page2 .count-wrap');
  const sideWrap = document.querySelector('#page2 .side-wrap');
  if (!overlay || !msg) return;

  const DELAY = 5 * 1000; // 5 seconds
  const PUSH_DURATION = 720; // should match CSS transition
  const T_FIRST = 6000; // Increased to allow list reading time
  const T_FEELING = 2200;
  const T_SECOND = 3800;

  function showOverlay() {
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    msg.setAttribute('aria-hidden', 'false');
  }

  function startSequence() {
    // push the main content up
    if (countWrap) countWrap.classList.add('pushed');
    if (sideWrap) sideWrap.classList.add('pushed');

    // wait for the push animation to complete, then show overlay and message flow
    setTimeout(() => {
      showOverlay();

      // 1) Did you notice? list
      msg.innerHTML = `<div style="font-weight: 700 ; font-size: clamp(3rem, 10vw, 9rem);" class="notice-title notice-strong">
          <span class="word-fade" style="animation-delay: 500ms">Did</span>
          <span class="word-fade" style="animation-delay: 750ms">you</span>
          <span class="word-fade" style="animation-delay: 1000ms">notice?</span>
        </div>
        <ul style="font-size: clamp(1.5rem, 5vw, 4rem); font-weight: 500;" class="notice-list">
          <li class="type-writer" style="animation-delay: 1600ms">Fake website address</li>
          <li class="type-writer" style="animation-delay: 2600ms">Fake Brand Colour</li>
          <li class="type-writer" style="animation-delay: 3600ms">Fake Logo</li>
        </ul>`;

      setTimeout(() => {
        // Animate out previous content
        Array.from(msg.children).forEach(el => el.classList.add('exit-right'));

        setTimeout(() => {
          // 2) Feeling is believing
          msg.innerHTML = `<div style="font-weight: 700; font-size: clamp(2.5rem, 8vw, 7.5rem);" class="notice-ephemeral notice-strong type-writer">
            <span style="display:inline-block">Feeling</span>&nbsp;<span style="display:inline-block">is</span>&nbsp;<span style="display:inline-block">believing</span>
          </div>`;

          setTimeout(() => {
            // Animate out word by word
            const container = msg.querySelector('div');
            if (container) container.style.clipPath = 'none';
            const spans = msg.querySelectorAll('span');
            spans.forEach((s, i) => {
              s.style.animationDelay = (i * 150) + 'ms';
              s.classList.add('exit-right');
            });

            setTimeout(() => {
              // 3) Like play like play + warning
              msg.innerHTML = `<div style="font-weight: 700; font-size: clamp(2.5rem, 8vw, 8rem);" class="notice-title notice-strong slide-up"><span class="shake-emphasis">Like play like play</span></div>
                <div style="margin-top:10px; font-size:clamp(1.3rem, 3.5vw, 3.5rem); animation-delay: 200ms;" class="slide-up">You could have just been scammed</div>
                <p style="margin-top:clamp(40px, 15vh, 120px); font-size:clamp(1.5rem, 4vw, 4rem); animation-delay: 1000ms;" class="notice-final slide-up">Not all advert/request are legit</p>
                <p style="margin-top:10px; font-size:clamp(1.5rem, 4vw, 4rem); animation-delay: 1200ms;" class="slide-up">Pay extra attention to details</p>`;
            }, 1000);
          }, T_FEELING);
        }, 600);
      }, T_FIRST);

    }, PUSH_DURATION);
  }

  // Export start function to be called after fetch loader completes
  window.startNoticeTimer = function() {
    let timer = setTimeout(startSequence, DELAY);
    window.__notice = { startSequence, cancel: () => clearTimeout(timer) };
  };
})();
</script>
</body>
</html>
