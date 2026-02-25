const form = document.getElementById("userForm");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const name = (formData.get('name') || '').toString();

    // Show loader while submitting to server
    showLoader();

    try {
      const resp = await fetch('submit.php', { method: 'POST', body: formData });
      const data = await resp.json();
      if (!data || !data.success) {
        console.error('Submission failed', data);
        hideLoader();
        alert('Submission failed. Please try again.');
        return;
      }

      const newCount = Number(data.count) || 0;
      const prevCount = Math.max(0, newCount - 1);

      // Redirect to standalone page2 which will fetch and display the count
      showLoader();
      setTimeout(() => {
        // ensure loader is visible briefly then navigate
        window.location.href = 'page2.php';
      }, 500);

    } catch (err) {
      console.error(err);
      hideLoader();
      alert('An error occurred. Please try again.');
    }
  });
} else {
  // No form on this page load — rely on DOMContentLoaded handler below to render tiles.
}


function goToPage(pageNumber) {
  const pages = document.querySelectorAll(".page");

  pages.forEach(page => {
    page.classList.remove("active");
  });

  document.getElementById("page" + pageNumber).classList.add("active");
  setPageHash(pageNumber);
}

// keep navigation state in the URL hash so refresh retains the page
function setPageHash(pageNumber) {
  try {
    if (pageNumber === 1) {
      // clear hash
      history.replaceState(null, '', location.pathname + location.search);
    } else {
      history.replaceState(null, '', '#page' + pageNumber);
    }
  } catch (e) {
    // fallback
    if (pageNumber === 1) location.hash = '';
    else location.hash = 'page' + pageNumber;
  }
}

// render tiles for victim count (pads to 4 digits)
function renderVictimTiles(fromCount, toCount) {
  const container = document.getElementById('victimTiles');
  if (!container) return;
  const fromStr = String(fromCount).padStart(4, '0');
  container.innerHTML = '';

  for (let i = 0; i < fromStr.length; i++) {
    const digit = fromStr[i];
    const tile = document.createElement('div');
    tile.className = 'tile';

    // Top half (static underneath)
    const topEl = document.createElement('div');
    topEl.className = 'top';
    topEl.setAttribute('data-val', digit);

    // Bottom half (static underneath)
    const bottomEl = document.createElement('div');
    bottomEl.className = 'bottom';
    bottomEl.setAttribute('data-val', digit);

    tile.appendChild(topEl);
    tile.appendChild(bottomEl);
    container.appendChild(tile);

    // stagger reveal
    setTimeout(() => tile.classList.add('show'), 80 * i + 60);
  }

  // If a target `toCount` is provided, animate from the shown value to the target after a delay
  if (typeof toCount !== 'undefined') {
    const toStr = String(toCount).padStart(4, '0');
    let baseDelay = 1200; // ms before starting the flip
    // Add an extra 1 second delay specifically on mobile screens so it matches desktop pacing
    if (window.innerWidth <= 760) {
      baseDelay += 500;
    }
    const perDigitStagger = 90; // ms additional per digit for reveal pipeline
    setTimeout(() => {
      animateCountChange(container, fromStr, toStr);
    }, baseDelay + fromStr.length * perDigitStagger);
  }
}

// Animate a full-number increment from `fromStr` to `toStr` using a 3D paper flip
function animateCountChange(container, fromStr, toStr) {
  for (let i = 0; i < toStr.length; i++) {
    const fromDigit = fromStr[i];
    const toDigit = toStr[i];
    if (fromDigit === toDigit) continue;

    const tile = container.children[i];
    if (!tile) continue;

    const topEl = tile.querySelector('.top');
    const bottomEl = tile.querySelector('.bottom');

    setTimeout(() => {
      // 1. Create the animating flaps
      const flipTop = document.createElement('div');
      flipTop.className = 'flip-top';
      flipTop.setAttribute('data-val', fromDigit); // Starts showing current digit

      const flipBottom = document.createElement('div');
      flipBottom.className = 'flip-bottom';
      flipBottom.setAttribute('data-val', toDigit); // Starts showing next digit (folded up)

      // Add flaps to DOM
      tile.appendChild(flipTop);
      tile.appendChild(flipBottom);

      // 2. The static top half immediately changes to the NEXT target digit
      // because the flipTop flap is covering it right now.
      topEl.setAttribute('data-val', toDigit);

      // 3. Trigger animations
      requestAnimationFrame(() => {
        flipTop.classList.add('animate');
      });

      // Once the top flap finishes folding down (250ms), animate the bottom flap unfolding
      setTimeout(() => {
        flipBottom.classList.add('animate');

        // When bottom flap finishes, update the static bottom half and clean up
        setTimeout(() => {
          bottomEl.setAttribute('data-val', toDigit);
          flipTop.remove();
          flipBottom.remove();
        }, 250);
      }, 250);

    }, Math.max(0, (toStr.length - 1 - i)) * 150); // animate hundreds/tens/ones right-to-left
  }
}

function restart() {
  goToPage(1);
}

// loader control
function showLoader() {
  const overlay = document.getElementById('loaderOverlay');
  if (!overlay) return;
  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('show');
}

function hideLoader() {
  const overlay = document.getElementById('loaderOverlay');
  if (!overlay) return;
  overlay.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('show');
}

// If we navigate to page2 directly (e.g., reload), ensure tiles are rendered
document.addEventListener('DOMContentLoaded', () => {
  // if URL hash indicates page2, show it and fetch count — this preserves page on refresh
  const hash = (location.hash || '').replace('#', '');
  if (hash === 'page2') {
    goToPage(2); // will set the hash too
    fetch('submit.php?action=count')
      .then(r => r.json())
      .then(data => {
        if (data && data.success) {
          const cnt = Number(data.count) || 0;
          renderVictimTiles(cnt, undefined);
        }
      })
      .catch(err => console.error('Failed to fetch count', err));
    return;
  }

  // Fallback: if a page already marked active is page2, render from server
  const currentPage = document.querySelector('.page.active');
  if (currentPage && currentPage.id === 'page2') {
    fetch('submit.php?action=count')
      .then(r => r.json())
      .then(data => {
        if (data && data.success) {
          const cnt = Number(data.count) || 0;
          renderVictimTiles(cnt, undefined);
        }
      })
      .catch(err => console.error('Failed to fetch count', err));
  }

  // Hamburger menu toggle logic
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
});