(function () {
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function T(ms, fn) { return setTimeout(fn, ms); }
  function an(el, k, o) { return el ? el.animate(k, Object.assign({ fill: 'forwards' }, o)) : null; }
  var EASE = 'cubic-bezier(.2,.7,.2,1)', POP = 'cubic-bezier(.3,1.6,.6,1)';
  if (RM) { $$('svg').forEach(function (s) { if (s.pauseAnimations) s.pauseAnimations(); }); }

  /* Filters, local demonstration reminder toggles, and carousel remain active. Reminder choices are not stored or sent anywhere. */
  var filters = $$('.filters button[data-filter]'), drops = $$('.drop'), sc = $('#scroller');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-filter');
      filters.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      drops.forEach(function (d) { d.hidden = !(key === 'all' || d.getAttribute('data-state') === key); });
      sc.scrollLeft = 0;
    });
  });
  function step(dir) { sc.scrollBy({ left: dir * 362, behavior: RM ? 'auto' : 'smooth' }); }
  $('#prev').addEventListener('click', function () { step(-1); });
  $('#next').addEventListener('click', function () { step(1); });
  $$('.remind button:not([disabled])').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var on = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', on ? 'false' : 'true');
      if (!RM && !on) an(btn, [{ transform: 'scale(.9)' }, { transform: 'scale(1.08)', offset: .6 }, { transform: 'scale(1)' }], { duration: 320, easing: EASE });
    });
  });

  if (RM || !('IntersectionObserver' in window)) return;

  /* Reveal blocks when they enter the viewport; keep them visible at rest. */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      var sibs = $$('.rv', e.target.parentNode), i = Math.max(0, sibs.indexOf(e.target));
      e.target.animate([{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: Math.min(i, 5) * 90, easing: EASE, fill: 'backwards' });
    });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  $$('.rv').forEach(function (el) { io.observe(el); });

  /* Draw the project stitching as the page scrolls. */
  var story = $('#story'), fillv = $('#fillv'), steps = $$('.step', story), ticking = false;
  function upd() {
    ticking = false;
    var r = story.getBoundingClientRect(), vh = window.innerHeight, line = vh * .62;
    var p = Math.max(0, Math.min(1, (line - r.top) / r.height));
    fillv.style.setProperty('--p', p.toFixed(3));
    steps.forEach(function (s) { s.classList.toggle('lit', s.getBoundingClientRect().top < line); });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }
  window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); upd();

  /* Arm sequences shortly before they enter, then play when clearly in view. */
  function gate(el, arm, play) {
    var armed = false;
    var a = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && !armed) { armed = true; arm(); } }); }, { rootMargin: '0px 0px 140px 0px' });
    var p = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        if (!armed) { armed = true; arm(); }
        a.disconnect(); p.disconnect(); play();
      });
    }, { rootMargin: '0px 0px -35% 0px' });
    a.observe(el); p.observe(el);
  }
  /* Reminder loop: draw the connecting threads dash by dash. */
  var loop = $('#loop');
  function stacked() { return window.matchMedia('(max-width: 999px)').matches; }
  if (loop) gate(loop, function () {
    loop.classList.add('armed');
    $$('.mp', loop).forEach(function (p) { try { p.style.setProperty('--L', (p.getTotalLength() || 1500) + 'px'); } catch (x) { p.style.setProperty('--L', '1500px'); } });
  }, function () {
    var cards = $$('.lc', loop), pill = $('.lpill', loop), links = $$('.llink', loop);
    var rise = [{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'none' }];
    if (stacked()) {
      cards.forEach(function (c, i) {
        T(120 + i * 480, function () {
          an(c, rise, { duration: 450, easing: EASE });
          if (i > 0) an(links[i - 1], [{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
        });
      });
      T(120 + 4 * 480, function () { an(pill, rise, { duration: 450, easing: EASE }); });
      return;
    }
    var plan = [[0, .23, .6, .75, .83], [1, 1.5, 1.9, 1.95, .68], [2, 2.65, 3.05, 3.1, .75], [3, 3.9, 4.3, 4.35, .83]];
    plan.forEach(function (s, i) {
      var c = cards[i], k = $('#lk' + i, loop), d = $('#lp' + i, loop), h = $('#lh' + i, loop), L = parseFloat(d.style.getPropertyValue('--L')) || 1500;
      T(s[1] * 1000, function () { an(c, rise, { duration: 450, easing: EASE }); });
      T(s[2] * 1000, function () { an(k, [{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 200, easing: POP }); });
      T(s[3] * 1000, function () { an(d, [{ strokeDashoffset: L + 'px' }, { strokeDashoffset: '0px' }], { duration: s[4] * 1000, easing: 'cubic-bezier(.42,0,.58,1)' }); });
      T((s[3] + s[4]) * 1000, function () { an(h, [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 210, easing: POP }); });
    });
    T(5.2 * 1000, function () { an(pill, rise, { duration: 450, easing: EASE }); });
  });

  function morph(orbs, pops, start) {
    orbs.forEach(function (orb, i) {
      var s = start + i * 160;
      T(s, function () {
        an(orb, [{ transform: 'rotate(0) scale(1)' }, { transform: 'translateX(-2px) rotate(-16deg)', offset: .12 }, { transform: 'translateX(2px) rotate(14deg)', offset: .24 }, { transform: 'translateX(-2px) rotate(-12deg)', offset: .36 }, { transform: 'translateX(1px) rotate(10deg) scale(1.05)', offset: .48 }, { transform: 'rotate(0) scale(1.08)', offset: .58 }, { transform: 'rotate(600deg) scale(0)' }], { duration: 760, easing: 'ease-in-out' });
      });
      if (pops[i]) T(s + 620, function () { an(pops[i], [{ opacity: 0, transform: 'scale(0) rotate(-220deg)' }, { opacity: 1, transform: 'scale(1.2) rotate(14deg)', offset: .7 }, { opacity: 1, transform: 'scale(1) rotate(0)' }], { duration: 460, easing: 'ease-out' }); });
    });
  }
  var road = $('#road'), roadM = $('.road-m');
  var vertical = function () { return window.matchMedia('(max-width: 860px)').matches; };
  var rise = [{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'none' }];
  if (road) gate(vertical() ? roadM : road, function () { if (!vertical()) road.classList.add('armed'); else $$('li', roadM).forEach(function (l) { l.style.opacity = 0; }); }, function () {
    if (vertical()) {
      var li = $$('li', roadM);
      li.forEach(function (l, i) { T(i * 280, function () { an(l, rise, { duration: 500, easing: EASE }); }); });
      morph($$('.tk .orb', roadM), $$('.tk .pop', roadM), li.length * 280 + 500);
      return;
    }
    var items = $$('.rt', road), dots = $$('.rd .dot', road), pops = $$('.rd .pop', road), fill = $('.rf', road), trav = $('.trav', road);
    var R = road.getBoundingClientRect(), pts = dots.map(function (d) { var b = d.getBoundingClientRect(); return { x: b.left + b.width / 2 - R.left, y: b.top + b.height / 2 - R.top }; });
    trav.style.left = (pts[0].x - 10) + 'px'; trav.style.top = (pts[0].y - 20) + 'px';
    var D = 900, t = 300;
    T(t, function () { an(items[0], rise, { duration: 450, easing: EASE }); });
    T(t + 350, function () { an(trav, [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 260, easing: POP }); });
    for (var i = 0; i < 5; i++) (function (i, s) {
      T(s, function () {
        an(trav, [{ opacity: 1, transform: 'translateX(' + (pts[i].x - pts[0].x) + 'px)' }, { opacity: 1, transform: 'translateX(' + (pts[i + 1].x - pts[0].x) + 'px)' }], { duration: D, easing: 'cubic-bezier(.45,0,.55,1)' });
        an(fill, [{ transform: 'scaleX(' + (i / 5) + ')' }, { transform: 'scaleX(' + ((i + 1) / 5) + ')' }], { duration: D, easing: 'cubic-bezier(.45,0,.55,1)' });
      });
      T(s + D, function () { an(items[i + 1], rise, { duration: 450, easing: EASE }); });
    })(i, 1000 + i * (D + 120));
    morph(dots, pops, 1000 + 5 * (D + 120) + 700);
  });
})();
