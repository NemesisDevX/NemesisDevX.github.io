(() => {
  'use strict';
  const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (motionOK) document.documentElement.classList.add('motion');
  document.querySelectorAll('.hero-line').forEach((line, i) => {
    const inner = line.querySelector('.line-inner');
    if (inner) inner.style.setProperty('--delay', `${0.13 + i * 0.23}s`);
  });
  // Progressive disclosure only; never hide the whole page behind a loading screen.
  if (motionOK && 'IntersectionObserver' in window) {
    const targets = Array.from(document.querySelectorAll('.reveal'));
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      });
    }, {threshold: 0.07, rootMargin: '0px 0px -16px 0px'});
    document.documentElement.classList.add('js-observe');
    targets.forEach(node => io.observe(node));
    // Fail open even if visibility events are unavailable/interrupted.
    window.setTimeout(() => document.documentElement.classList.remove('js-observe'), 3600);
  }
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.mobile-nav');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      menu.classList.toggle('open', open);
    });
    menu.querySelectorAll('a').forEach(anchor => anchor.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }
})();