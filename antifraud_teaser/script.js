const form = document.getElementById("userForm");

if (form) {
  form.addEventListener("submit", async function(e) {
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

    // single digit panel
    const digitEl = document.createElement('div');
    digitEl.className = 'digit';
    digitEl.textContent = digit;

    // flipper overlay that will slide up with the next digit
    const flipper = document.createElement('div');
    flipper.className = 'flipper';
    flipper.textContent = digit;

    tile.appendChild(digitEl);
    tile.appendChild(flipper);

    container.appendChild(tile);

    // stagger reveal (faster)
    setTimeout(() => tile.classList.add('show'), 80 * i + 60);
  }

  // If a target `toCount` is provided, animate from the shown value to the target after a delay
  if (typeof toCount !== 'undefined') {
    const toStr = String(toCount).padStart(4, '0');
    // shorter delay so flips begin sooner after reveal
    const baseDelay = 1200; // ms before starting the flip
    const perDigitStagger = 90; // ms additional per digit for reveal pipeline
    setTimeout(() => {
      animateCountChange(container, fromStr, toStr);
    }, baseDelay + fromStr.length * perDigitStagger);
  }
}

// Animate a full-number increment from `fromStr` to `toStr` by flipping only differing digits
function animateCountChange(container, fromStr, toStr) {
  for (let i = 0; i < toStr.length; i++) {
    const fromDigit = fromStr[i];
    const toDigit = toStr[i];
    if (fromDigit === toDigit) continue;

    const tile = container.children[i];
    if (!tile) continue;

    const digitEl = tile.querySelector('.digit');
    const flipper = tile.querySelector('.flipper');

    // set the flipper to show the next digit
    flipper.textContent = toDigit;

    setTimeout(() => {
      // prepare and run clean slide-up transition
      flipper.textContent = toDigit;
      // trigger CSS transitions in next frame
      requestAnimationFrame(() => {
        digitEl.classList.add('up');
        flipper.classList.add('flip');
      });

      // after flipper transition ends, commit the new digit and reset classes
      const onEnd = (ev) => {
        if (ev.propertyName && !/transform|opacity/.test(ev.propertyName)) return;
        flipper.classList.remove('flip');
        digitEl.classList.remove('up');
        digitEl.textContent = toDigit;
        flipper.removeEventListener('transitionend', onEnd);
      };
      flipper.addEventListener('transitionend', onEnd);
    }, i * 300);
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
});