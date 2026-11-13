/* ============================================================
   LOADER — Loading screen chậm ~4.5s
   ============================================================ */
(function () {
  'use strict';

  const html    = document.documentElement;
  const loader  = document.getElementById('loader');
  const fill    = document.getElementById('loaderFill');
  const percent = document.getElementById('loaderPercent');
  if (!loader || !fill || !percent) return;

  // Nếu từng chạy xong (reload do zoom) → dọn ngay
  if (window.__azerLoaded) {
    loader.remove();
    html.classList.remove('loading');
    return;
  }

  html.classList.add('loading');

  let progress = 0, loaded = false, done = false, tick, tFade, tRemove;

  const render = (v) => {
    const p = Math.round(v);
    fill.style.width = p + '%';
    percent.textContent = p + '%';
  };

  const finish = () => {
    if (done) return;
    done = true;
    window.__azerLoaded = true;
    clearInterval(tick);
    clearTimeout(tFade);
    clearTimeout(tRemove);
    render(100);
    tFade = setTimeout(() => {
      loader.classList.add('hide');
      html.classList.remove('loading');
      tRemove = setTimeout(() => loader.remove(), 900);
    }, 900);
  };

  const markLoaded = () => {
    if (loaded) return;
    loaded = true;
    if (progress < 88) progress = 88;
  };

  tick = setInterval(() => {
    if (done) return;
    let step;
    if (progress < 30)      step = 2 + Math.random() * 1.5;
    else if (progress < 60) step = 1 + Math.random();
    else if (progress < 88) step = 0.5 + Math.random() * 0.6;
    else                    step = loaded ? 4 : 0.15;

    progress = Math.min(loaded ? 100 : 88, progress + step);
    render(progress);
    if (progress >= 100) finish();
  }, 200);

  if (document.readyState === 'complete') markLoaded();
  else window.addEventListener('load', markLoaded, { once: true });

  setTimeout(() => {
    if (!loaded) { loaded = true; if (progress < 88) progress = 88; }
  }, 12000);

  /* An toàn khi zoom / resize */
  const safety = () => {
    if ((done || window.__azerLoaded) && loader.parentNode) {
      loader.classList.add('hide');
      html.classList.remove('loading');
      clearTimeout(tRemove);
      tRemove = setTimeout(() => { if (loader.parentNode) loader.remove(); }, 350);
    }
  };
  window.addEventListener('resize', safety, { passive: true });
  window.addEventListener('orientationchange', safety, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', safety, { passive: true });
  }
})();
