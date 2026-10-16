(function () {
  // Motion is opt-in via the fx class set in <head>; without it every element keeps its final state
  var root = document.documentElement;

  function inView(elements, callback, options) {
    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { callback(el, 0); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      var batchIndex = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        callback(entry.target, batchIndex++);
      });
    }, options || { threshold: 0.15 });

    elements.forEach(function (el) { observer.observe(el); });
  }

  // 1. Name resolves from random glyphs, letter by letter
  function initNameDecode() {
    var el = document.querySelector('[data-decode]');
    if (!el) return;

    var finalText = el.textContent;
    // Scramble within the same case so the name keeps roughly its final width and doesn't wrap
    var upper = 'ABCDEFGHIKLNOPRSTUVXYZ';
    var lower = 'abcdeghknopqrsuvxyz';
    var resolveAt = finalText.split('').map(function (_, i) {
      return 300 + i * 55 + Math.random() * 200;
    });
    var start = null;

    function frame(now) {
      if (start === null) start = now;
      var elapsed = now - start;
      var done = true;

      el.textContent = finalText.split('').map(function (char, i) {
        if (char === ' ' || elapsed >= resolveAt[i]) return char;
        done = false;
        var glyphs = char === char.toUpperCase() ? upper : lower;
        return glyphs.charAt(Math.floor(Math.random() * glyphs.length));
      }).join('');

      if (!done) window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
  }

  // 2 + 3. Section headings flicker on like a neon sign, then type out with a cursor
  function initSectionHeadings() {
    var headers = Array.prototype.slice.call(document.querySelectorAll('.section-header'));

    headers.forEach(function (header) {
      var label = header.querySelector('span');
      if (!label) return;
      header.setAttribute('aria-label', label.textContent);
      label.setAttribute('data-text', label.textContent);
      label.textContent = '';
    });

    inView(headers, function (header) {
      var label = header.querySelector('span');
      var section = header.closest('.content-section');
      if (!label) return;

      header.classList.add('is-powering');
      if (section) section.classList.add('is-powering');

      var text = label.getAttribute('data-text');
      var typed = document.createElement('span');
      var cursor = document.createElement('span');
      cursor.className = 'type-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      cursor.textContent = '▊';
      label.appendChild(typed);
      label.appendChild(cursor);

      var i = 0;
      setTimeout(function typeNext() {
        typed.textContent = text.slice(0, ++i);
        if (i < text.length) {
          setTimeout(typeNext, 45);
        } else {
          setTimeout(function () { cursor.remove(); }, 1600);
        }
      }, 350);
    }, { threshold: 0.6 });
  }

  // 5. Count-up for the experience badge and the offer progress
  function animateValue(duration, onFrame) {
    var start = null;
    function frame(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / duration, 1);
      onFrame(1 - Math.pow(1 - t, 3));
      if (t < 1) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  function initCountUps() {
    var experienceEl = document.querySelector('[data-experience]');
    var match = experienceEl && experienceEl.textContent.match(/(\d+) years (\d+) months/);
    if (match) {
      var totalMonths = parseInt(match[1], 10) * 12 + parseInt(match[2], 10);
      animateValue(1800, function (p) {
        var months = Math.round(totalMonths * p);
        experienceEl.textContent = Math.floor(months / 12) + ' years ' + (months % 12) + ' months';
      });
    }

    var progress = document.querySelector('[data-offer-progress]');
    if (!progress) return;
    var claimedEl = progress.querySelector('[data-offer-claimed]');
    var fillEl = progress.querySelector('[data-offer-fill]');
    var target = claimedEl ? parseInt(claimedEl.textContent, 10) : 0;
    var targetWidth = fillEl ? fillEl.style.width : '';

    if (claimedEl) claimedEl.textContent = '0';
    if (fillEl) fillEl.style.width = '0%';

    inView([progress], function () {
      if (fillEl) {
        fillEl.classList.add('is-counting');
        // Next frame so the 0% width is committed before transitioning
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () { fillEl.style.width = targetWidth; });
        });
      }
      if (claimedEl) {
        animateValue(1400, function (p) {
          claimedEl.textContent = Math.round(target * p);
        });
      }
    }, { threshold: 0.5 });
  }

  // 6. Screenshots tilt toward the pointer with a moving glare (mouse/trackpad only)
  function initTilt() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      var frameRequested = false;
      var lastEvent = null;

      function apply() {
        frameRequested = false;
        var rect = card.getBoundingClientRect();
        // Clamp in case the card scrolled since the pointer moved
        var x = Math.min(Math.max((lastEvent.clientX - rect.left) / rect.width, 0), 1);
        var y = Math.min(Math.max((lastEvent.clientY - rect.top) / rect.height, 0), 1);
        card.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * 10).toFixed(2) +
          'deg) rotateY(' + ((x - 0.5) * 12).toFixed(2) + 'deg) scale(1.02)';
        card.style.setProperty('--glare-x', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--glare-y', (y * 100).toFixed(1) + '%');
      }

      card.addEventListener('pointerenter', function () {
        card.classList.add('is-tilting');
      });

      card.addEventListener('pointermove', function (event) {
        lastEvent = event;
        if (!frameRequested) {
          frameRequested = true;
          window.requestAnimationFrame(apply);
        }
      });

      card.addEventListener('pointerleave', function () {
        card.classList.remove('is-tilting');
        card.style.transform = '';
      });
    });
  }

  // 7. Screenshots draw in behind a glowing scanline
  function initScanlineReveal() {
    var shots = Array.prototype.slice.call(document.querySelectorAll('.site-shot'));
    inView(shots, function (shot) {
      shot.classList.add('is-revealed');
    }, { threshold: 0.3 });
  }

  // 11. Entries fade and slide up, staggered when several enter together
  function initStaggerReveal() {
    var items = Array.prototype.slice.call(
      document.querySelectorAll('.site-entry, .project-entry, .timeline-entry')
    );
    inView(items, function (item, batchIndex) {
      item.style.setProperty('--reveal-delay', (batchIndex * 0.1) + 's');
      item.classList.add('is-visible');
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
  }

  // 12. Timeline line grows with scroll; each dot lights when the line reaches it
  function initTimelineDraw() {
    var timeline = document.querySelector('.timeline');
    if (!timeline) return;
    var entries = Array.prototype.slice.call(timeline.querySelectorAll('.timeline-entry'));
    var ticking = false;

    function update() {
      ticking = false;
      var rect = timeline.getBoundingClientRect();
      var drawLine = window.innerHeight * 0.65;
      var progress = Math.min(Math.max((drawLine - rect.top) / rect.height, 0), 1);
      timeline.style.setProperty('--timeline-progress', progress.toFixed(4));

      entries.forEach(function (entry) {
        var dot = entry.querySelector('.timeline-dot');
        if (!dot) return;
        var reached = dot.getBoundingClientRect().top <= drawLine;
        entry.classList.toggle('is-lit', reached);
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  // 14. Skill icons orbit the photo like electrons: fade in slowly, spin up, fade out, rest, repeat
  function initAtomOrbit() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.profile-orbit .orbit-item'));
    if (!items.length) return;

    var RX = 6.75; // rem, long axis of each electron path
    var RY = 2.25; // rem, short axis, makes the path read as a tilted ring
    var SLOW = 0.6; // rad/s
    var FAST = 28; // rad/s
    // Cycle timings in seconds
    var FADE_IN = 2;
    var CRUISE = 4;
    var SPIN_UP = 3;
    var FULL_SPEED = 2; // held at top speed before the fade starts
    var FADE_OUT = 1;
    var REST = 10;
    var ACTIVE = FADE_IN + CRUISE + SPIN_UP + FULL_SPEED;
    var CYCLE = ACTIVE + REST;

    // Pair icons on three orbital planes 60deg apart, opposite each other on their plane
    var electrons = items.map(function (el, i) {
      var plane = i % 3;
      var tilt = (plane * 60 - 30) * Math.PI / 180;
      return {
        el: el,
        cos: Math.cos(tilt),
        sin: Math.sin(tilt),
        phase: Math.floor(i / 3) * Math.PI + plane * 0.9,
        rate: [1, 1.18, 0.86][plane]
      };
    });

    var angle = 0;
    var clock = 0;
    var last = null;

    function frame(now) {
      // Clamp so a backgrounded tab doesn't jump the cycle on return
      var dt = last === null ? 0 : Math.min((now - last) / 1000, 0.05);
      last = now;
      clock = (clock + dt) % CYCLE;

      var speed = SLOW;
      var opacity = 0;
      var spin = 0;
      if (clock < FADE_IN) {
        opacity = clock / FADE_IN;
      } else if (clock < FADE_IN + CRUISE) {
        opacity = 1;
      } else if (clock < ACTIVE) {
        spin = Math.min(1, (clock - FADE_IN - CRUISE) / SPIN_UP);
        speed = SLOW + (FAST - SLOW) * spin * spin * spin;
        opacity = Math.min(1, (ACTIVE - clock) / FADE_OUT);
      }
      angle += speed * dt;

      if (opacity > 0) {
        var blur = (spin * spin * 3).toFixed(2);
        electrons.forEach(function (e) {
          var t = angle * e.rate + e.phase;
          var ex = Math.cos(t) * RX;
          var ey = Math.sin(t) * RY;
          var x = ex * e.cos - ey * e.sin;
          var y = ex * e.sin + ey * e.cos;
          // sin(t) < 0 is the far side of the orbit: shrink, dim and tuck behind the photo
          var depth = Math.sin(t);
          var scale = 0.85 + 0.15 * depth;
          e.el.style.transform = 'translate(' + x.toFixed(3) + 'rem,' + y.toFixed(3) + 'rem) scale(' + scale.toFixed(3) + ')';
          e.el.style.opacity = (opacity * (0.75 + 0.25 * depth)).toFixed(3);
          e.el.style.zIndex = depth < 0 ? '0' : '2';
          e.el.style.filter = blur > 0 ? 'blur(' + blur + 'px)' : '';
        });
      } else {
        electrons.forEach(function (e) { e.el.style.opacity = '0'; });
      }

      window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
  }

  // 13. Soft glow trailing the cursor across the background (mouse/trackpad only)
  function initCursorGlow() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var shell = document.querySelector('.page-shell');
    if (!shell) return;

    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    shell.appendChild(glow);

    var targetX = 0;
    var targetY = 0;
    var x = 0;
    var y = 0;
    var running = false;

    // Ease toward the pointer so the glow trails slightly behind it
    function step() {
      x += (targetX - x) * 0.15;
      y += (targetY - y) * 0.15;
      glow.style.transform = 'translate3d(' + x.toFixed(1) + 'px, ' + y.toFixed(1) + 'px, 0)';
      if (Math.abs(targetX - x) > 0.5 || Math.abs(targetY - y) > 0.5) {
        window.requestAnimationFrame(step);
      } else {
        running = false;
      }
    }

    window.addEventListener('pointermove', function (event) {
      if (event.pointerType !== 'mouse') return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!glow.classList.contains('is-active')) {
        x = targetX;
        y = targetY;
        glow.classList.add('is-active');
      }
      if (!running) {
        running = true;
        window.requestAnimationFrame(step);
      }
    }, { passive: true });

    document.addEventListener('pointerleave', function () {
      glow.classList.remove('is-active');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!root.classList.contains('fx')) return;
    initNameDecode();
    initSectionHeadings();
    initCountUps();
    initTilt();
    initScanlineReveal();
    initStaggerReveal();
    initTimelineDraw();
    initCursorGlow();
    initAtomOrbit();
  });
})();
