// Session Expiry Manager
// Tracks user activity and shows a popup when session expires due to inactivity.
// Redirects to /identification?expired=true after expiry.
(function () {
  const SESSION_DURATION = 30 * 60; // 30 minutes in seconds
  const WARNING_AT = 60; // show warning 60s before expiry
  const STORAGE_KEY = 'session_last_active';
  const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

  let tickInterval = null;
  let warnShown = false;

  // ── Helpers ─────────────────────────────────────────────
  function getLastActive() {
    return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  }

  function setLastActive() {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  }

  function getRemaining() {
    const elapsed = Math.floor((Date.now() - getLastActive()) / 1000);
    return Math.max(0, SESSION_DURATION - elapsed);
  }

  // ── UI ──────────────────────────────────────────────────
  function showExpiredPopup() {
    const overlay = document.getElementById('session-expired-overlay');
    const container = document.getElementById('session-expired-container');
    if (overlay) overlay.classList.add('active');
    if (container) container.classList.add('active');
  }

  function showWarning(secondsLeft) {
    const overlay = document.getElementById('session-expired-overlay');
    const container = document.getElementById('session-expired-container');
    const msg = document.getElementById('session-expired-msg');
    if (msg) {
      msg.innerHTML = 'Your session will expire in <strong>' + secondsLeft + '</strong> seconds.<br>Move your mouse or press a key to stay logged in.';
    }
    if (overlay) overlay.classList.add('active');
    if (container) container.classList.add('active');
  }

  function hideWarning() {
    const overlay = document.getElementById('session-expired-overlay');
    const container = document.getElementById('session-expired-container');
    const msg = document.getElementById('session-expired-msg');
    if (overlay) overlay.classList.remove('active');
    if (container) container.classList.remove('active');
    if (msg) {
      msg.innerHTML = 'You have been idle for too long. <br> Please log in again.';
    }
  }

  // ── Core ────────────────────────────────────────────────
  function handleExpiry() {
    stop();
    localStorage.removeItem(STORAGE_KEY);
    showExpiredPopup();
    var msg = document.getElementById('session-expired-msg');
    if (msg) {
      msg.innerHTML = 'You have been idle for too long. <br> Please log in again.';
    }

    // OK button redirects
    var okBtn = document.getElementById('session-expired-ok');
    if (okBtn) {
      okBtn.addEventListener('click', function () {
        window.location.href = '/signout?expired=true';
      });
    }

    // Auto-redirect after 10 seconds if user doesn't click
    setTimeout(function () {
      window.location.href = '/signout?expired=true';
    }, 10000);
  }

  function tick() {
    var remaining = getRemaining();

    if (remaining <= 0) {
      handleExpiry();
      return;
    }

    if (remaining <= WARNING_AT && !warnShown) {
      warnShown = true;
      showWarning(remaining);
    }

    // Update countdown while warning is shown
    if (warnShown && remaining > 0) {
      var msg = document.getElementById('session-expired-msg');
      if (msg) {
        msg.innerHTML = 'Your session will expire in <strong>' + remaining + '</strong> seconds.<br>Move your mouse or press a key to stay logged in.';
      }
    }
  }

  function onActivity() {
    setLastActive();
    if (warnShown) {
      warnShown = false;
      hideWarning();
    }
  }

  function start() {
    setLastActive();
    warnShown = false;

    ACTIVITY_EVENTS.forEach(function (evt) {
      document.addEventListener(evt, onActivity, { passive: true });
    });

    tickInterval = setInterval(tick, 1000);
    tick();
  }

  function stop() {
    clearInterval(tickInterval);
    ACTIVITY_EVENTS.forEach(function (evt) {
      document.removeEventListener(evt, onActivity);
    });
  }

  // ── Test helpers (use from browser console) ────────────
  // Usage:
  //   SessionTest.warning()   → show the warning popup
  //   SessionTest.expire()    → trigger full expiry (redirect)
  //   SessionTest.remaining() → seconds left
  //   SessionTest.setTimer(10)→ reset timer to 10 seconds (expires in 10s)
  window.SessionTest = {
    warning: function () { showWarning(60); warnShown = true; },
    expire: function () { handleExpiry(); },
    remaining: function () { return getRemaining(); },
    setTimer: function (seconds) {
      // Fake last activity so session expires in `seconds` from now
      var fakeLastActive = Date.now() - (SESSION_DURATION - seconds) * 1000;
      localStorage.setItem(STORAGE_KEY, fakeLastActive.toString());
      warnShown = false;
      console.log('Session will expire in ' + seconds + ' seconds. Stop moving your mouse!');
    }
  };

  // ── Init ────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
