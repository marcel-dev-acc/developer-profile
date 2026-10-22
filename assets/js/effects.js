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

  function theme() {
    return root.getAttribute('data-theme') || 'professional';
  }

  // 1. Name intro, replayed on theme change: neon resolves it from random glyphs; the other
  //    themes animate the letters in CSS (graffiti tags them, blueprint plots them, professional fades up)
  function initNameIntro() {
    var el = document.querySelector('[data-decode]');
    if (!el) return;

    // One span per letter so themes can colour and animate each one
    var chars = [];
    var finalText = el.textContent;
    el.textContent = '';
    finalText.split('').forEach(function (char) {
      if (char === ' ') {
        el.appendChild(document.createTextNode(' '));
        return;
      }
      var span = document.createElement('span');
      span.className = 'name-char';
      span.style.setProperty('--i', chars.length);
      span.textContent = char;
      el.appendChild(span);
      chars.push({ el: span, char: char });
    });

    // Scramble within the same case so the name keeps roughly its final width and doesn't wrap
    var upper = 'ABCDEFGHIKLNOPRSTUVXYZ';
    var lower = 'abcdeghknopqrsuvxyz';
    var run = 0;

    function decode() {
      var thisRun = ++run;
      var resolveAt = chars.map(function (_, i) {
        return 300 + i * 55 + Math.random() * 200;
      });
      var start = null;

      function frame(now) {
        if (thisRun !== run) return;
        if (start === null) start = now;
        var elapsed = now - start;
        var done = true;

        chars.forEach(function (c, i) {
          if (elapsed >= resolveAt[i]) {
            c.el.textContent = c.char;
            return;
          }
          done = false;
          var glyphs = c.char === c.char.toUpperCase() ? upper : lower;
          c.el.textContent = glyphs.charAt(Math.floor(Math.random() * glyphs.length));
        });

        if (!done) window.requestAnimationFrame(frame);
      }

      window.requestAnimationFrame(frame);
    }

    function cssIntro() {
      run++;
      chars.forEach(function (c) { c.el.textContent = c.char; });
      el.classList.remove('is-intro');
      void el.offsetWidth; // restart the CSS animation
      el.classList.add('is-intro');
    }

    function play() {
      if (theme() === 'neon') {
        el.classList.remove('is-intro');
        decode();
      } else {
        cssIntro();
      }
    }

    document.addEventListener('themechange', play);
    play();
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
      // Professional keeps it calm: the heading fades in whole (CSS) rather than typing
      if (theme() === 'professional') {
        label.textContent = text;
        return;
      }

      // Graffiti stencil-sprays the letters onto the stripe; blueprint letters them along
      // a guide line. Both animate per-letter spans in CSS instead of typing
      if (theme() === 'graffiti' || theme() === 'blueprint') {
        // Letters are grouped into words that can't break, so a long heading wraps between
        // words rather than between any two letters
        label.textContent = '';
        var index = 0;
        text.split(' ').forEach(function (word, w) {
          if (w > 0) {
            label.appendChild(document.createTextNode(' '));
            index++;
          }
          var wordEl = document.createElement('span');
          wordEl.className = 'heading-word';
          word.split('').forEach(function (char) {
            var span = document.createElement('span');
            span.className = 'heading-char';
            span.style.setProperty('--i', index++);
            span.textContent = char;
            wordEl.appendChild(span);
          });
          label.appendChild(wordEl);
        });
        return;
      }

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

  // 5. Count-up for the experience badge
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

  // 7. Screenshots draw in. Neon (scanline) and professional (fade) are pure CSS on is-revealed;
  //    graffiti and blueprint hide each image under a canvas and erase it with spray or pen hatching
  var CANVAS_REVEALS = {
    graffiti: function (shot) { sprayReveal(shot); },
    blueprint: function (shot) { hatchReveal(shot); }
  };

  function initShotReveal() {
    var shots = Array.prototype.slice.call(document.querySelectorAll('.site-shot'));

    function syncCovers() {
      shots.forEach(function (shot) {
        if (shot.classList.contains('is-revealed')) return;
        if (CANVAS_REVEALS[theme()]) coverShot(shot); else uncoverShot(shot);
      });
    }

    syncCovers();
    document.addEventListener('themechange', syncCovers);

    inView(shots, function (shot) {
      shot.classList.add('is-revealed');
      var reveal = CANVAS_REVEALS[theme()];
      if (shot.sprayCover && reveal) reveal(shot);
    }, { threshold: 0.3 });
  }

  // The cover's flat CSS fill matches the theme's panel until a reveal paints it onto the canvas
  var COVER_COLORS = { graffiti: '#141112', blueprint: '#15477f' };

  function coverShot(shot) {
    if (shot.sprayCover) return;
    var canvas = document.createElement('canvas');
    canvas.className = 'shot-cover';
    canvas.setAttribute('aria-hidden', 'true');
    shot.appendChild(canvas);
    shot.sprayCover = canvas;
  }

  function uncoverShot(shot) {
    if (!shot.sprayCover) return;
    shot.sprayCover.remove();
    shot.sprayCover = null;
  }

  // Waits for the screenshot to load, then sizes the cover canvas and fills it with the theme colour
  function prepareCover(shot, onReady) {
    var canvas = shot.sprayCover;
    var img = shot.querySelector('img');
    var loaded = img && !img.complete
      ? new Promise(function (resolve) {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        })
      : Promise.resolve();

    loaded.then(function () {
      if (shot.sprayCover !== canvas) return; // theme switched away meanwhile
      var w = shot.clientWidth;
      var h = shot.clientHeight;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      var ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.fillStyle = COVER_COLORS[theme()] || '#000';
      ctx.fillRect(0, 0, w, h);
      canvas.classList.add('is-painting');
      ctx.globalCompositeOperation = 'destination-out';
      onReady(canvas, ctx, w, h);
    });
  }

  // Fades out what's left of the cover along with the tool that drew it
  function finishCover(shot, canvas, tool) {
    tool.classList.add('is-done');
    canvas.classList.add('is-done');
    setTimeout(function () {
      tool.remove();
      if (shot.sprayCover === canvas) uncoverShot(shot);
    }, 600);
  }

  // Soft round burst with speckled edges, stamped along the nozzle's path
  function makeSprayBrush(radius) {
    var size = Math.ceil(radius * 2);
    var brush = document.createElement('canvas');
    brush.width = brush.height = size;
    var ctx = brush.getContext('2d');
    var gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius * 0.75);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000';
    for (var i = 0; i < 140; i++) {
      // Squaring bunches speckles toward the centre like a real can
      var r = Math.pow(Math.random(), 1.6) * radius;
      var a = Math.random() * Math.PI * 2;
      ctx.globalAlpha = 0.3 + Math.random() * 0.7;
      ctx.beginPath();
      ctx.arc(radius + Math.cos(a) * r, radius + Math.sin(a) * r, 0.5 + Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    return brush;
  }

  function sprayReveal(shot) {
    prepareCover(shot, function (canvas, ctx, w, h) {
      var can = document.createElement('span');
      can.className = 'shot-spray-can';
      can.setAttribute('aria-hidden', 'true');
      shot.appendChild(can);

      // One pass, west to east: the can travels straight across at mid-height and its
      // spray fans out to cover the full height of the image as it goes
      var bands = Math.max(3, Math.round(h / 70));
      var bandHeight = h / bands;
      var radius = bandHeight * 0.95;
      var brush = makeSprayBrush(radius);
      var overshoot = radius * 0.4;
      var travel = w + overshoot * 2;
      var step = radius * 0.2; // px between stamps, so the bursts overlap however wide the image is
      var DURATION = 1800;
      var start = null;
      var done = 0;

      function frame(now) {
        if (start === null) start = now;
        var t = Math.min((now - start) / DURATION, 1);
        var target = t * travel;

        for (; done <= target; done += step) {
          var x = -overshoot + done;
          for (var band = 0; band < bands; band++) {
            ctx.save();
            ctx.translate(
              x + (Math.random() - 0.5) * step,
              (band + 0.5) * bandHeight + (Math.random() - 0.5) * bandHeight * 0.3
            );
            ctx.rotate(Math.random() * Math.PI * 2);
            ctx.drawImage(brush, -radius, -radius);
            ctx.restore();
          }
        }

        var nozzleX = -overshoot + Math.min(target, travel);
        can.style.transform = 'translate(' + nozzleX.toFixed(1) + 'px, ' + (h / 2).toFixed(1) + 'px)';

        if (t < 1) {
          window.requestAnimationFrame(frame);
          return;
        }

        // Clear the last specks of wall and put the can away
        finishCover(shot, canvas, can);
      }

      window.requestAnimationFrame(frame);
    });
  }

  // Blueprint: a drafting pen hatches the image in with diagonal strokes, then cross-hatches it
  function hatchReveal(shot) {
    prepareCover(shot, function (canvas, ctx, w, h) {
      var pen = document.createElement('span');
      pen.className = 'shot-pen';
      pen.setAttribute('aria-hidden', 'true');
      shot.appendChild(pen);

      var SPACING = 7;
      var DURATION = 1700;
      var lines = Math.ceil((w + h) / SPACING) + 1;
      // Each pass sweeps its strokes across the image; the cross pass starts as the first ends
      var passes = [
        { from: 0, to: 0.55, dir: 1, width: 3.6 },
        { from: 0.45, to: 0.9, dir: -1, width: 2.6 }
      ];
      var drawn = [0, 0];
      var start = null;

      // Stroke k of a pass runs along x + dir*y = k*SPACING, clipped to the image
      function stroke(k, dir) {
        var c = k * SPACING;
        if (dir === 1) {
          return { x1: c, y1: 0, x2: c - h, y2: h };
        }
        return { x1: w - c, y1: 0, x2: w - c + h, y2: h };
      }

      ctx.lineCap = 'round';

      function frame(now) {
        if (start === null) start = now;
        var t = Math.min((now - start) / DURATION, 1);
        var tip = null;

        passes.forEach(function (pass, i) {
          var local = Math.min(Math.max((t - pass.from) / (pass.to - pass.from), 0), 1);
          var target = Math.floor(local * lines);
          ctx.lineWidth = pass.width;
          for (; drawn[i] < target; drawn[i]++) {
            var line = stroke(drawn[i], pass.dir);
            ctx.beginPath();
            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
            ctx.stroke();
          }
          if (local > 0 && local < 1) {
            var current = stroke(drawn[i], pass.dir);
            // Pen bounces along its stroke as it hatches
            var along = (now / 90) % 2;
            along = along > 1 ? 2 - along : along;
            tip = {
              x: Math.min(Math.max(current.x1 + (current.x2 - current.x1) * along, 0), w),
              y: Math.min(Math.max(current.y1 + (current.y2 - current.y1) * along, 0), h)
            };
          }
        });

        if (tip) {
          pen.style.transform = 'translate(' + tip.x.toFixed(1) + 'px, ' + tip.y.toFixed(1) + 'px)';
        }

        if (t < 1) {
          window.requestAnimationFrame(frame);
          return;
        }

        // Ink in whatever the hatching missed
        finishCover(shot, canvas, pen);
      }

      window.requestAnimationFrame(frame);
    });
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

  // 14. Mobile: the background, glows and shimmers stay still (fx-boot) while the intro plays,
  //     then come in once the main thread is free
  function initAmbientStagger() {
    if (!root.classList.contains('fx-boot')) return;
    setTimeout(function () {
      var release = function () { root.classList.remove('fx-boot'); };
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(release, { timeout: 1000 });
      } else {
        release();
      }
    }, 2000);
  }

  // 15. Looping animations pause while their block is off screen, so only what's visible costs anything
  function initOffscreenPause() {
    if (!('IntersectionObserver' in window)) return;
    var zones = document.querySelectorAll('.profile-header, .neon-cta, .switch-offer, .content-section');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('fx-offscreen', !entry.isIntersecting);
      });
    }, { rootMargin: '100px 0px' });
    zones.forEach(function (zone) { observer.observe(zone); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!root.classList.contains('fx')) return;
    initAmbientStagger();
    initOffscreenPause();
    initNameIntro();
    initSectionHeadings();
    initCountUps();
    initTilt();
    initShotReveal();
    initStaggerReveal();
    initTimelineDraw();
    initCursorGlow();
  });
})();
