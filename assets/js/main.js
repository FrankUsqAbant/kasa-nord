/* ============================================================
   KASA NORD — behaviour
   Rule: every animation REVEALS something. Nothing decorative.
   ============================================================ */
(function () {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. reveal on enter ----------
     A rootMargin that is too aggressive leaves content permanently invisible:
     the observer only fires while the element is inside the (shrunk) viewport,
     so a slow scroll can land between breakpoints and never trigger. The
     safety net below makes invisibility impossible: anything already past
     the fold, or still hidden after load, gets forced in. */
  const revealTargets = document.querySelectorAll('[data-reveal]');
  const forceIn = el => el.classList.add('is-in');

  if (reduced || !('IntersectionObserver' in window)) {
    revealTargets.forEach(forceIn);
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        forceIn(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    revealTargets.forEach(el => io.observe(el));

    // safety net: reveal anything at/below the fold right away
    const sweep = () => {
      const vh = innerHeight;
      revealTargets.forEach(el => {
        if (el.classList.contains('is-in')) return;
        if (el.getBoundingClientRect().top < vh * 1.15) forceIn(el);
      });
    };
    sweep();
    addEventListener('scroll', sweep, { passive: true });
    addEventListener('load', sweep);
    // last resort: if the page has not been scrolled, show everything after 1.2s
    setTimeout(sweep, 1200);
  }

  /* ---------- 2. word stagger on display headings ---------- */
  document.querySelectorAll('[data-split]').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = '<span class="split-line">' +
      words.map(w => `<span class="split-word">${w}</span>`).join(' ') +
      '</span>';
    if (reduced) el.classList.add('is-in');
  });
  // the split text only fires once its block scrolls in
  const splits = document.querySelectorAll('[data-split]');
  if (splits.length && !reduced && 'IntersectionObserver' in window) {
    const io2 = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.35 });
    splits.forEach(el => io2.observe(el));
  }

  /* ---------- 3. sticky nav ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 40);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 4. counters ---------- */
  const nums = document.querySelectorAll('[data-count]');
  if (nums.length) {
    const run = el => {
      const target = parseFloat(el.dataset.count);
      const dec = (el.dataset.count.split('.')[1] || '').length;
      if (reduced) { el.textContent = target.toFixed(dec); return; }
      const dur = 1400, t0 = performance.now();
      const step = now => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = (target * eased).toFixed(dec);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      const io3 = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          run(e.target); obs.unobserve(e.target);
        });
      }, { threshold: 0.6 });
      nums.forEach(el => io3.observe(el));
    } else nums.forEach(run);
  }

  /* ---------- 5. magnetic CTA ---------- */
  if (!reduced && matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      const strength = 0.28;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * strength;
        const dy = (e.clientY - (r.top + r.height / 2)) * strength;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- 6. lazy images fade in on decode ----------
     Guarded: an image that 404s or errors must never be left at opacity 0,
     because that turns a broken asset into an invisible block of layout. */
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.style.transition = 'opacity 620ms cubic-bezier(0.16,1,0.3,1)';
    const show = () => { img.style.opacity = '1'; };
    if (img.complete) {
      if (img.naturalWidth > 0) show();
      else { img.style.opacity = '1'; }   // broken: show it anyway
      return;
    }
    img.addEventListener('load', show, { once: true });
    img.addEventListener('error', show, { once: true });
    // never leave a photo invisible
    setTimeout(show, 2500);
  });
})();
