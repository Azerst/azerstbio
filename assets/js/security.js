/* ============================================================
   SECURITY — Anti-DevTools / Anti-View-Source
   Chạy TRƯỚC mọi script khác.
   ============================================================ */
(function () {
  'use strict';

  if (window.__azerSecured) return;
  window.__azerSecured = true;

  /* -------- Reload an toàn (chống loop) -------- */
  let reloading = false;

  function hardReload() {
    if (reloading) return;
    reloading = true;
    try {
      const count = parseInt(sessionStorage.getItem('_ar') || '0', 10);
      if (count >= 3) {
        // Đã reload 3 lần liên tiếp → dừng để tránh loop vô hạn
        sessionStorage.removeItem('_ar');
        reloading = false;
        return;
      }
      sessionStorage.setItem('_ar', String(count + 1));
      // Reset bộ đếm sau 5s
      setTimeout(() => {
        try { sessionStorage.removeItem('_ar'); } catch (e) {}
      }, 5000);
    } catch (e) {}
    try { location.reload(); } catch (e) { location.href = location.href; }
  }

  /* ============================================================
     1) Chặn phím tắt mở DevTools / View Source / Save Page
     ============================================================ */
  document.addEventListener('keydown', function (e) {
    const k = (e.key || '').toLowerCase();
    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;

    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      hardReload();
      return false;
    }
    // Ctrl/Cmd + Shift + I / J / C / K
    if (ctrl && shift && (k === 'i' || k === 'j' || k === 'c' || k === 'k')) {
      e.preventDefault();
      e.stopPropagation();
      hardReload();
      return false;
    }
    // Ctrl/Cmd + U (view source)
    if (ctrl && k === 'u') {
      e.preventDefault();
      e.stopPropagation();
      hardReload();
      return false;
    }
    // Ctrl/Cmd + S (save page)
    if (ctrl && k === 's') {
      e.preventDefault();
      e.stopPropagation();
      hardReload();
      return false;
    }
  }, { passive: false, capture: true });

  /* ============================================================
     2) Chặn chuột phải
     ============================================================ */
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
  }, { passive: false });

  /* ============================================================
     3) Chặn copy / cut / select / drag
     ============================================================ */
  ['copy', 'cut', 'selectstart', 'dragstart'].forEach(function (evt) {
    document.addEventListener(evt, function (e) {
      const tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) return;
      e.preventDefault();
    }, { passive: false });
  });

  // Ngăn kéo ảnh ra ngoài
  document.addEventListener('dragstart', function (e) {
    if (e.target && e.target.tagName === 'IMG') e.preventDefault();
  }, { passive: false });

  /* ============================================================
     4) Phát hiện DevTools mở (docked) → reload
     ============================================================ */
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

  if (!isMobile) {
    let suspicious = 0;
    const THRESHOLD = 180;      // px chênh lệch outer-inner
    const CONFIRM_COUNT = 2;    // cần 2 lần liên tiếp để tránh false positive
    const CHECK_INTERVAL = 1200;

    setInterval(function () {
      if (document.visibilityState !== 'visible') return;

      try {
        const wDiff = Math.abs(window.outerWidth - window.innerWidth);
        const hDiff = Math.abs(window.outerHeight - window.innerHeight);

        if (wDiff > THRESHOLD || hDiff > THRESHOLD) {
          suspicious++;
          if (suspicious >= CONFIRM_COUNT) hardReload();
        } else {
          suspicious = 0;
        }
      } catch (e) {}
    }, CHECK_INTERVAL);
  }

  /* ============================================================
     5) Chặn Ctrl+A / Ctrl+C toàn cục (bổ sung)
     ============================================================ */
  document.addEventListener('keydown', function (e) {
    const tag = (e.target && e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) return;

    const ctrl = e.ctrlKey || e.metaKey;
    if (!ctrl) return;
    const k = (e.key || '').toLowerCase();

    if (k === 'a' || k === 'c' || k === 'x') {
      e.preventDefault();
    }
  }, { passive: false });

})();
