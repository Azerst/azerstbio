/* ============================================================
   APP — Tilt 3D, Popover, Show More, Image fallback
   ============================================================ */
(function () {
  'use strict';

  /* -------- Image fallback (thay cho onerror inline) -------- */
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    const handleError = () => {
      img.style.display = 'none';
      if (img.parentNode) img.parentNode.textContent = img.dataset.fallback || '';
    };
    if (img.complete && img.naturalWidth === 0) {
      handleError();
    } else {
      img.addEventListener('error', handleError, { once: true });
    }
  });

  /* -------- Tilt 3D -------- */
  (function () {
    const card = document.getElementById('card');
    if (!card || !window.matchMedia('(pointer:fine)').matches) return;

    card.addEventListener('pointermove', function (e) {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - .5;
      const y = (e.clientY - r.top ) / r.height - .5;
      card.style.transform = 'perspective(1100px) rotateY(' + (x * 5) + 'deg) rotateX(' + (-y * 5) + 'deg) translateY(-2px)';
    });
    card.addEventListener('pointerleave', function () {
      card.style.transform = 'perspective(1100px) rotateY(0) rotateX(0) translateY(0)';
    });
  })();

  /* -------- Creator popover -------- */
  (function () {
    const trigger = document.getElementById('creatorTrigger');
    const popover = document.getElementById('creatorPopover');
    if (!trigger || !popover) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      popover.classList.toggle('show');
    });
    document.addEventListener('click', function (e) {
      if (!popover.contains(e.target) && e.target !== trigger) {
        popover.classList.remove('show');
      }
    });
  })();

  /* -------- Show More -------- */
  (function () {
    const btn = document.getElementById('showMoreBtn');
    if (!btn) return;

    const sections = [
      { el: document.getElementById('gioi-thieu'), delay: 0.10 },
      { el: document.getElementById('hanh-trinh'), delay: 0.25 },
      { el: document.getElementById('lien-he'),    delay: 0.40 }
    ];

    btn.addEventListener('click', function () {
      btn.style.display = 'none';
      document.body.classList.add('expanded');
      sections.forEach(function (item) {
        if (!item.el) return;
        item.el.style.display = 'block';
        item.el.style.animation = 'fadeUp .85s ' + item.delay + 's cubic-bezier(.2,.8,.2,1) both';
      });
    });
  })();

})();
