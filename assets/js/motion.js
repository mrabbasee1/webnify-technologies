/* Webnify Technologies: motion layer.
 *
 * GSAP 3.15 + ScrollTrigger + SplitText. The page fetches these files once it
 * has loaded and the browser is idle, so they never compete with the first
 * paint. This is progressive enhancement only: without them the page keeps
 * its CSS/IntersectionObserver reveals and stays fully usable. The hero
 * entrance is CSS-only (in the page).
 *
 * Speed rules followed here:
 * - set-up runs when the browser is idle
 * - three passes: all layout reads, then all style writes, then every
 *   ScrollTrigger is created (they measure once, nothing is thrashed)
 * - headings are split into words only when they scroll into view
 * - only transform, opacity and clip-path are animated
 *
 * Shared by index.html (EN) and hu/index.html (HU): nothing in here is
 * language specific.
 */
(function () {
  'use strict';

  var w = window;
  var d = document;
  var gsap = w.gsap;
  var ST = w.ScrollTrigger;
  var Split = w.SplitText;

  if (!gsap || !ST) return;
  if (w.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ST);
  if (Split) gsap.registerPlugin(Split);
  ST.config({ ignoreMobileResize: true });

  var EASE = 'expo.out';
  var CLEAR = 'transform,opacity,visibility,transition';

  function $(sel, ctx) { return (ctx || d).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || d).querySelectorAll(sel)); }

  function init() {
    var desk = w.matchMedia('(min-width: 981px)').matches;
    var Y = desk ? 1 : 0.6; // shorter travel on phones
    var later = [];         // pass 3: ScrollTriggers, created after every style write

    // ---------- pass 1: reads ----------
    // The page's own observer may have revealed something while this file was
    // loading: that stays as it is instead of blinking out and back in.
    var vh = w.innerHeight;
    var done = new Set();
    $$('.reveal, .wk, .rev, .foot > div, .js-form .fld, .js-form button[type=submit]').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top >= vh || r.bottom <= 0) return;           // off screen: animate it later
      var rev = el.classList.contains('reveal') ? el : el.closest('.reveal');
      if (!rev || rev.classList.contains('in')) done.add(el); // already visible: leave it
    });
    function fresh(el) { return !!el && !done.has(el); }

    // ---------- pass 2: writes ----------
    if (w.lenisInstance && typeof w.lenisInstance.on === 'function') {
      w.lenisInstance.on('scroll', ST.update); // Lenis (mouse/trackpad only) drives the scroll
    }
    d.documentElement.classList.add('gs'); // GSAP owns the reveals now (`.gs .reveal` in the CSS)

    // GSAP drives transform/opacity, so CSS transitions on those are off while
    // it runs; everything goes back to the stylesheet afterwards (hover lifts
    // and the like keep working).
    function hide(t, vars) { gsap.set(t, Object.assign({ transition: 'none', autoAlpha: 0 }, vars || {})); }
    function show(t, vars) {
      return gsap.to(t, Object.assign({
        x: 0, y: 0, yPercent: 0, rotate: 0, scale: 1, autoAlpha: 1, duration: 1, ease: EASE,
        onComplete: function () { gsap.set(t, { clearProps: CLEAR }); }
      }, vars || {}));
    }
    function on(trigger, start, fn) {
      later.push(function () { ST.create({ trigger: trigger, start: start || 'top 88%', once: true, onEnter: fn }); });
    }
    function scrub(tween, trigger, start, end, s) {
      later.push(function () { ST.create({ animation: tween, trigger: trigger, start: start, end: end, scrub: s === undefined ? true : s }); });
    }
    function words(h, delay) {
      var sp = Split ? Split.create(h, { type: 'words', mask: 'words', wordsClass: 'sw' }) : null;
      gsap.set(h, { clearProps: 'opacity,visibility,transition' });
      if (sp) gsap.from(sp.words, { yPercent: 115, rotate: 4, duration: 1.05, ease: EASE, stagger: 0.055, delay: delay || 0, onComplete: function () { sp.revert(); } });
    }

    // Eyebrow + heading (split into words when it arrives) + the copy below.
    function head(box, restSel) {
      if (!fresh(box)) return;
      var eb = $('.eyebrow', box);
      var h = $('h2', box);
      var rest = $$(restSel || ':scope > p', box);
      if (eb) hide(eb, { x: -28 });
      if (h) hide(h);
      if (rest.length) hide(rest, { y: 26 * Y });
      on(box, 'top 86%', function () {
        if (eb) show(eb, { duration: 0.7 });
        if (h) words(h, 0.05);
        if (rest.length) show(rest, { duration: 0.9, stagger: 0.07, delay: 0.3 });
      });
    }

    // A group of siblings rising in one after another.
    function rise(list, from, to, trigger, start) {
      list = list.filter(fresh);
      if (!list.length) return;
      hide(list, from);
      on(trigger || list[0], start, function () { show(list, Object.assign({ stagger: 0.1 }, to || {})); });
    }

    // ---------- section headings (services, work, process, reviews) ----------
    $$('.sec-head').forEach(function (b) { head(b); });

    // ---------- about ----------
    var av = $('.about-visual');
    var ph = av ? $('.av-photo', av) : null;
    if (fresh(av)) {
      var badge = $('.badge', av);
      gsap.set(av, { clipPath: 'inset(100% 0% 0% 0% round 26px)' });
      if (ph) gsap.set(ph, { scale: 1.4 });
      if (badge) hide(badge, { y: 40 });
      on(av, 'top 82%', function () {
        gsap.to(av, { clipPath: 'inset(0% 0% 0% 0% round 26px)', duration: 1.5, ease: 'expo.inOut', clearProps: 'clipPath' });
        if (ph) gsap.to(ph, { scale: desk ? 1.12 : 1, duration: 2, ease: EASE, delay: 0.15 });
        if (badge) show(badge, { duration: 0.9, delay: 0.95 });
      });
    } else if (ph && desk) {
      gsap.set(ph, { scale: 1.12 });
    }
    if (ph && desk) {
      scrub(gsap.fromTo(ph, { yPercent: -5 }, { yPercent: 5, ease: 'none', paused: true }), av, 'top bottom', 'bottom top');
    }
    head($('.about .wrap > .reveal:not(.about-visual)'), ':scope > p, :scope > ul > li, :scope > .btn');

    // ---------- stats ----------
    rise($$('.statband .st'), { y: 46 * Y }, null, $('.statband'));

    // ---------- services ----------
    var sg = $('.svcx-grid');
    if (fresh(sg)) {
      var items = $$('.svcx-item', sg);
      var panel = $('.svcx-panel', sg);
      hide(items, { x: -44 * Y });
      if (panel) hide(panel, { y: 70 * Y, scale: 0.96 });
      on(sg, 'top 86%', function () {
        show(items, { duration: 0.9, stagger: 0.07 });
        if (panel) show(panel, { duration: 1.2, delay: 0.12 });
      });
    }

    // ---------- work ----------
    rise($$('.wk').slice(0, desk ? 4 : 2), { y: 90 * Y, rotate: desk ? 2.5 : 0 }, { duration: 1.15, stagger: 0.09 }, $('.wk-marq'));
    rise($$('.wk-cta'), { y: 30 });

    // ---------- process ----------
    var grid = $('.step-grid');
    if (grid) {
      var steps = $$('.step', grid).filter(fresh);
      if (steps.length) {
        var icons = $$('.step-ic', grid);
        var nums = $$('.step-no', grid);
        hide(steps, { y: 80 * Y });
        gsap.set(icons, { scale: 0, rotate: -25 });
        hide(nums, { yPercent: 60 });
        on(grid, 'top 84%', function () {
          show(steps, { duration: 1.1, stagger: 0.14 });
          gsap.to(icons, { scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(2.2)', stagger: 0.14, delay: 0.25, clearProps: 'transform' });
          show(nums, { stagger: 0.14, delay: 0.2 });
        });
      }
      // the dashed line between the steps draws itself as you scroll (desktop)
      if (desk) scrub(gsap.fromTo(grid, { '--ln': 0 }, { '--ln': 1, ease: 'none', paused: true }), grid, 'top 78%', 'top 30%', 0.6);
    }

    // ---------- reviews ----------
    rise($$('.rev').slice(0, desk ? 4 : 2), { y: 60 * Y }, { stagger: 0.08 }, $('.rev-marq'));

    // ---------- contact ----------
    head($('.contact .wrap > .reveal'), ':scope > p, :scope > .ci, :scope > .c-soc, :scope > .c-btn');
    var form = $('.contact .js-form');
    if (form) rise($$('.fld, button[type=submit]', form), { y: 30 * Y }, { duration: 0.9, stagger: 0.06 }, form);

    // ---------- call to action ----------
    var cta = $('.cta');
    if (cta && fresh($('.reveal', cta))) {
      var ch = $('h2', cta);
      var crest = $$('.wrap > p, .wrap > .btn', cta);
      hide(cta, { y: 90 * Y, scale: 0.92 });
      if (ch) hide(ch);
      hide(crest, { y: 24 });
      on(cta, 'top 86%', function () {
        show(cta, { duration: 1.3 });
        if (ch) words(ch, 0.3);
        show(crest, { duration: 0.8, stagger: 0.1, delay: 0.55 });
      });
    }

    // ---------- footer ----------
    rise($$('.foot > div'), { y: 40 * Y }, { duration: 0.95, stagger: 0.09 }, $('.foot'));

    // ---------- desktop depth: hero drifts away, backgrounds move slower ----------
    if (desk) {
      var hero = $('.hero');
      var copy = $('.hero .wrap > div:first-child');
      var shot = $('.hero .showcase');
      if (hero && (copy || shot)) {
        var htl = gsap.timeline({ paused: true });
        if (copy) htl.to(copy, { y: -110, autoAlpha: 0.15, ease: 'none' }, 0);
        if (shot) htl.to(shot, { y: -50, ease: 'none' }, 0);
        scrub(htl, hero, 'top top', 'bottom top', 0.5);
      }
      $$('.statband .mesh, .cta .mesh').forEach(function (m) {
        scrub(gsap.fromTo(m, { yPercent: -10 }, { yPercent: 10, ease: 'none', paused: true }), m.parentNode, 'top bottom', 'bottom top');
      });
    }

    // ---------- reading progress bar ----------
    var bar = d.createElement('div');
    bar.className = 'scroll-bar';
    bar.setAttribute('aria-hidden', 'true');
    d.body.appendChild(bar);
    later.push(function () {
      ST.create({ animation: gsap.to(bar, { scaleX: 1, ease: 'none', paused: true }), start: 0, end: 'max', scrub: 0.3 });
    });

    // ---------- pass 3: every ScrollTrigger measures once ----------
    later.forEach(function (fn) { fn(); });

    // ---------- magnetic buttons (mouse only) ----------
    if (w.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      $$('.hero-cta .btn, .cta .btn, .nav-right > .btn').forEach(function (b) {
        var xTo = gsap.quickTo(b, 'x', { duration: 0.45, ease: 'power3.out' });
        var yTo = gsap.quickTo(b, 'y', { duration: 0.45, ease: 'power3.out' });
        b.addEventListener('mouseenter', function () { b.style.transition = 'box-shadow .2s, background .2s'; });
        b.addEventListener('mousemove', function (e) {
          var r = b.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.28);
          yTo((e.clientY - r.top - r.height / 2) * 0.4 - 2);
        });
        b.addEventListener('mouseleave', function () {
          gsap.to(b, {
            x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)', overwrite: 'auto',
            onComplete: function () { b.style.transition = ''; gsap.set(b, { clearProps: 'transform' }); }
          });
        });
      });
    }
    // ScrollTrigger measures again on its own after resize.
  }

  if (w.requestIdleCallback) w.requestIdleCallback(init, { timeout: 1200 });
  else w.setTimeout(init, 120);
})();
