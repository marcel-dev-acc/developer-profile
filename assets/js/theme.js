/*
 * Site themes. Loaded synchronously in <head> so the saved theme is applied
 * before first paint, then builds the picker in the bottom-right corner.
 * Each theme is a data-theme value on <html>; themes.css holds the skins.
 * A "themechange" event fires on document when the visitor switches.
 */
(function () {
  var STORAGE_KEY = 'site-theme';
  var DEFAULT_THEME = 'neon';
  var THEMES = [
    { id: 'neon', name: 'Neon', description: 'Purple glow, terminals and flicker' },
    {
      id: 'graffiti',
      name: 'Graffiti',
      description: 'Spray paint on a brick wall',
      fonts: 'https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Rubik:wght@400;500;700&family=Sedgwick+Ave+Display&display=swap'
    },
    {
      id: 'blueprint',
      name: 'Blueprint',
      description: 'Drafted like an engineering plan',
      fonts: 'https://fonts.googleapis.com/css2?family=Architects+Daughter&family=IBM+Plex+Mono:wght@400;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap'
    }
    // Professional is styled in themes.css but hidden from the picker for now
    // {
    //   id: 'professional',
    //   name: 'Professional',
    //   description: 'Clean, light and to the point',
    //   fonts: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    // }
  ];

  var root = document.documentElement;
  var loadedFonts = {};
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function findTheme(id) {
    for (var i = 0; i < THEMES.length; i++) {
      if (THEMES[i].id === id) return THEMES[i];
    }
    return null;
  }

  function readStored() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  // Returns whether the choice was saved, so a reload will come back in this theme
  function store(id) {
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
      return window.localStorage.getItem(STORAGE_KEY) === id;
    } catch (e) {
      return false; // private mode or storage blocked
    }
  }

  function loadFonts(theme) {
    if (!theme.fonts || loadedFonts[theme.id]) return;
    loadedFonts[theme.id] = true;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = theme.fonts;
    document.head.appendChild(link);
  }

  function currentTheme() {
    return root.getAttribute('data-theme') || DEFAULT_THEME;
  }

  function setTheme(id) {
    var theme = findTheme(id) || findTheme(DEFAULT_THEME);
    loadFonts(theme);
    root.setAttribute('data-theme', theme.id);
    return theme;
  }

  // Apply before paint
  setTheme(readStored() || DEFAULT_THEME);

  window.siteTheme = { current: currentTheme, themes: THEMES };

  function scrollToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  // Start the page over in the new theme, from the top, with every effect initialised
  // from scratch. Drops any #section hash so the reload doesn't jump back down to it.
  function reloadFresh() {
    scrollToTop();
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.location.reload();
  }

  function switchTheme(id, origin) {
    if (id === currentTheme()) return;
    var saved = store(id);

    function commit() {
      setTheme(id);
      document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: id } }));
    }

    scrollToTop();

    // Without storage a reload would lose the choice, so switch in place instead
    if (!saved) {
      commit();
      return;
    }

    if (!document.startViewTransition || reducedMotion) {
      reloadFresh();
      return;
    }

    // Paint the new theme in as a circle growing out of the picker, then reload into it.
    // On mobile the ambient loops hold still meanwhile (fx-hold) so the circle animates smoothly;
    // the reload starts them again after its own intro.
    var stagger = root.classList.contains('fx-stagger');
    if (stagger) root.classList.add('fx-hold');

    var x = origin ? origin.x : window.innerWidth;
    var y = origin ? origin.y : window.innerHeight;
    var radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    var transition = document.startViewTransition(commit);
    transition.ready.then(function () {
      root.animate(
        { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: stagger ? 550 : 700, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(function () { /* transition skipped; the theme is already applied */ });
    transition.finished.then(reloadFresh, reloadFresh);
  }

  function swatch(id) {
    var el = document.createElement('span');
    el.className = 'theme-swatch theme-swatch--' + id;
    el.setAttribute('aria-hidden', 'true');
    return el;
  }

  function initPicker() {
    var picker = document.createElement('div');
    picker.className = 'theme-picker';

    var menu = document.createElement('div');
    menu.className = 'theme-picker-menu';
    menu.id = 'theme-picker-menu';
    menu.setAttribute('role', 'group');
    menu.setAttribute('aria-label', 'Choose a theme');

    var heading = document.createElement('p');
    heading.className = 'theme-picker-heading';
    heading.textContent = 'Theme';
    menu.appendChild(heading);

    var options = THEMES.map(function (theme, i) {
      var option = document.createElement('button');
      option.type = 'button';
      option.className = 'theme-option';
      option.style.setProperty('--option-index', i);
      option.setAttribute('data-theme-option', theme.id);

      var text = document.createElement('span');
      text.className = 'theme-option-text';
      var name = document.createElement('span');
      name.className = 'theme-option-name';
      name.textContent = theme.name;
      var desc = document.createElement('span');
      desc.className = 'theme-option-desc';
      desc.textContent = theme.description;
      text.appendChild(name);
      text.appendChild(desc);

      option.appendChild(swatch(theme.id));
      option.appendChild(text);
      menu.appendChild(option);
      return option;
    });

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'theme-picker-toggle';
    toggle.setAttribute('aria-controls', menu.id);
    toggle.setAttribute('aria-expanded', 'false');

    picker.appendChild(menu);
    picker.appendChild(toggle);
    document.body.appendChild(picker);

    function sync() {
      var active = findTheme(currentTheme());
      toggle.innerHTML = '';
      toggle.appendChild(swatch(active.id));
      toggle.setAttribute('aria-label', 'Theme: ' + active.name + '. Change theme');
      options.forEach(function (option) {
        option.setAttribute('aria-pressed', String(option.getAttribute('data-theme-option') === active.id));
      });
    }

    function isOpen() {
      return picker.classList.contains('is-open');
    }

    function open() {
      picker.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      var pressed = menu.querySelector('[aria-pressed="true"]');
      if (pressed) pressed.focus();
    }

    function close(returnFocus) {
      if (!isOpen()) return;
      picker.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', function () {
      if (isOpen()) close(false); else open();
    });

    options.forEach(function (option) {
      option.addEventListener('click', function () {
        var rect = toggle.getBoundingClientRect();
        close(true);
        switchTheme(option.getAttribute('data-theme-option'), {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) close(true);
    });

    document.addEventListener('pointerdown', function (event) {
      if (isOpen() && !picker.contains(event.target)) close(false);
    });

    document.addEventListener('themechange', sync);
    sync();
  }

  // Graffiti: a mist of spray paint follows the pointer and clicks leave dripping splats.
  // Painted on a canvas behind the page content, so it only shows on the wall.
  function initSprayPaint() {
    if (reducedMotion) return;

    var COLORS = ['#ff2e88', '#ffe14d', '#2de2e6', '#a3ff12', '#ff7a1a'];
    var MIST_LIFE = 1400; // ms
    var SPLAT_LIFE = 5000; // ms
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    var canvas = null;
    var ctx = null;
    var dpr = 1;
    var mist = [];
    var splats = [];
    var colorIndex = 0;
    var running = false;
    var last = null;

    function active() {
      return currentTheme() === 'graffiti';
    }

    function ensureCanvas() {
      if (canvas) return;
      canvas = document.createElement('canvas');
      canvas.className = 'spray-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.appendChild(canvas);
      ctx = canvas.getContext('2d');
      resize();
      window.addEventListener('resize', resize);
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function start() {
      if (running) return;
      running = true;
      last = null;
      window.requestAnimationFrame(frame);
    }

    function spray(x, y, count, radius, color) {
      for (var i = 0; i < count; i++) {
        // Squaring the random distance bunches paint toward the nozzle like a real can
        var r = Math.pow(Math.random(), 2) * radius;
        var a = Math.random() * Math.PI * 2;
        mist.push({
          x: x + Math.cos(a) * r,
          y: y + Math.sin(a) * r,
          size: 0.6 + Math.random() * 1.6,
          color: color,
          age: 0
        });
      }
      if (mist.length > 2400) mist.splice(0, mist.length - 2400);
    }

    function splat(x, y) {
      var color = COLORS[colorIndex++ % COLORS.length];
      var blobs = [];
      var count = 7 + Math.floor(Math.random() * 6);
      for (var i = 0; i < count; i++) {
        var a = Math.random() * Math.PI * 2;
        var d = Math.random() * 26;
        blobs.push({ x: Math.cos(a) * d, y: Math.sin(a) * d, r: 6 + Math.random() * 14 });
      }
      var drips = [];
      var dripCount = 2 + Math.floor(Math.random() * 3);
      for (var j = 0; j < dripCount; j++) {
        drips.push({
          x: (Math.random() - 0.5) * 40,
          width: 3 + Math.random() * 4,
          length: 30 + Math.random() * 70,
          speed: 0.4 + Math.random() * 0.6
        });
      }
      splats.push({ x: x, y: y, color: color, blobs: blobs, drips: drips, age: 0 });
      if (splats.length > 25) splats.shift();
      spray(x, y, 140, 60, color);
      start();
    }

    function frame(now) {
      var dt = last === null ? 16 : Math.min(now - last, 50);
      last = now;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      splats = splats.filter(function (s) {
        s.age += dt;
        if (s.age > SPLAT_LIFE) return false;
        var grow = Math.min(s.age / 120, 1);
        ctx.globalAlpha = 0.85 * Math.min(1, (SPLAT_LIFE - s.age) / 1200);
        ctx.fillStyle = s.color;
        s.blobs.forEach(function (b) {
          ctx.beginPath();
          ctx.arc(s.x + b.x * grow, s.y + b.y * grow, b.r * grow, 0, Math.PI * 2);
          ctx.fill();
        });
        s.drips.forEach(function (d) {
          var length = Math.min(d.length, Math.max(0, s.age - 150) * d.speed * 0.12);
          if (length <= 0) return;
          var x = s.x + d.x;
          ctx.fillRect(x - d.width / 2, s.y, d.width, length);
          ctx.beginPath();
          ctx.arc(x, s.y + length, d.width * 0.75, 0, Math.PI * 2);
          ctx.fill();
        });
        return true;
      });

      mist = mist.filter(function (p) {
        p.age += dt;
        if (p.age > MIST_LIFE) return false;
        ctx.globalAlpha = 0.7 * (1 - p.age / MIST_LIFE);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        return true;
      });
      ctx.globalAlpha = 1;

      if (mist.length || splats.length) {
        window.requestAnimationFrame(frame);
      } else {
        running = false;
      }
    }

    document.addEventListener('pointermove', function (event) {
      if (!finePointer || !active()) return;
      ensureCanvas();
      spray(event.clientX, event.clientY, 10, 16, COLORS[colorIndex % COLORS.length]);
      start();
    }, { passive: true });

    document.addEventListener('pointerdown', function (event) {
      if (!active() || event.target.closest('.theme-picker')) return;
      ensureCanvas();
      splat(event.clientX, event.clientY);
    }, { passive: true });

    document.addEventListener('themechange', function () {
      if (active() || !canvas) return;
      mist = [];
      splats = [];
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    });
  }

  // Blueprint: CAD-style guide lines cross at the pointer, with a live coordinate readout.
  // The guides sit behind the page content; the readout floats beside the pointer.
  function initCadCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var guideX = null;
    var guideY = null;
    var readout = null;
    var lastEvent = null;
    var frameRequested = false;

    function active() {
      return currentTheme() === 'blueprint';
    }

    function ensureElements() {
      if (readout) return;
      guideX = document.createElement('div');
      guideX.className = 'cad-guide cad-guide-x';
      guideY = document.createElement('div');
      guideY.className = 'cad-guide cad-guide-y';
      readout = document.createElement('div');
      readout.className = 'cad-readout';
      [guideX, guideY, readout].forEach(function (el) {
        el.setAttribute('aria-hidden', 'true');
        document.body.appendChild(el);
      });
    }

    function pad(n) {
      return ('0000' + Math.max(0, Math.round(n))).slice(-4);
    }

    function render() {
      frameRequested = false;
      if (!lastEvent) return;
      var x = lastEvent.clientX;
      var y = lastEvent.clientY;
      guideX.style.transform = 'translateY(' + y + 'px)';
      guideY.style.transform = 'translateX(' + x + 'px)';
      readout.style.transform = 'translate(' + (x + 16) + 'px, ' + (y + 18) + 'px)';
      readout.textContent = 'X ' + pad(x + window.scrollX) + '  Y ' + pad(y + window.scrollY);
    }

    function request() {
      if (!frameRequested) {
        frameRequested = true;
        window.requestAnimationFrame(render);
      }
    }

    function hide() {
      if (readout) document.body.classList.remove('cad-cursor-on');
    }

    document.addEventListener('pointermove', function (event) {
      if (event.pointerType !== 'mouse' || !active()) return;
      ensureElements();
      lastEvent = event;
      document.body.classList.add('cad-cursor-on');
      request();
    }, { passive: true });

    window.addEventListener('scroll', function () {
      if (active() && readout) request();
    }, { passive: true });

    document.documentElement.addEventListener('pointerleave', hide);
    document.addEventListener('themechange', function () {
      if (!active()) hide();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPicker();
    initSprayPaint();
    initCadCursor();
  });
})();
