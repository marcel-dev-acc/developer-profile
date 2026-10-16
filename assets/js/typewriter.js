(function () {
  var TEXTS = [
    "I am a seasoned Senior Software Developer delivering secure, fault-tolerant solutions across mobile, web, backend, and infrastructure.",
    "I work closely with clients on requirements and solution architecture, then lead testing, documentation, and handover to ensure reliable delivery.",
    "I mentor engineers, run React Native knowledge-sharing, and champion continuous learning and security-focused engineering practices."
  ];

  var TYPING_SPEED = 50;
  var DELETING_SPEED = 30;
  var PAUSE_TIME = 3000;

  var root = document.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function theme() {
    return root.getAttribute('data-theme') || 'neon';
  }

  // Timeouts a mode can cancel all at once when the theme changes
  function createTimers() {
    var ids = [];
    return {
      set: function (fn, ms) { ids.push(setTimeout(fn, ms)); },
      clear: function () { ids.forEach(clearTimeout); ids = []; }
    };
  }

  // Splits a statement into word spans so a mode can write it word by word
  function wordsInto(el, text) {
    return text.split(' ').map(function (word, i) {
      if (i > 0) el.appendChild(document.createTextNode(' '));
      var span = document.createElement('span');
      span.className = 'bio-word';
      span.textContent = word;
      el.appendChild(span);
      return span;
    });
  }

  // Moves a writing tool to the end of a word, relative to the stage it's drawn on.
  // Any tilt goes after the translate so it turns the tool, not the path it travels.
  function placeTool(tool, word, stage, tilt) {
    var w = word.getBoundingClientRect();
    var s = stage.getBoundingClientRect();
    tool.style.transform = 'translate(' + (w.right - s.left).toFixed(1) + 'px, ' + (w.top - s.top).toFixed(1) + 'px)' +
      (tilt ? ' rotate(' + tilt + 'deg)' : '');
  }

  // Neon: types each statement at a terminal prompt, deletes it, moves on
  function startNeon(ctx) {
    var timers = createTimers();
    var currentTextIndex = 0;
    var displayedText = '';
    var isDeleting = false;

    function scheduleNext() {
      var currentText = TEXTS[currentTextIndex];

      if (!isDeleting && displayedText === currentText) {
        timers.set(function () {
          isDeleting = true;
          scheduleNext();
        }, PAUSE_TIME);
        return;
      }

      if (isDeleting && displayedText === '') {
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % TEXTS.length;
        scheduleNext();
        return;
      }

      timers.set(function () {
        displayedText = isDeleting
          ? currentText.substring(0, displayedText.length - 1)
          : currentText.substring(0, displayedText.length + 1);
        ctx.textEl.textContent = displayedText;
        scheduleNext();
      }, isDeleting ? DELETING_SPEED : TYPING_SPEED);
    }

    scheduleNext();

    var blink = ctx.cursorEl && setInterval(function () {
      ctx.cursorEl.classList.toggle('hidden');
    }, 530);

    return function stop() {
      timers.clear();
      if (blink) clearInterval(blink);
      ctx.textEl.textContent = '';
    };
  }

  // Graffiti: each statement is tagged on in marker, then buffed out with grey paint
  // and the next goes up in a new colour
  var GRAFFITI_PAINTS = ['var(--g-pink)', 'var(--g-yellow)', 'var(--g-cyan)', 'var(--g-lime)'];
  var WORD_TIME = 110;
  var HOLD_TIME = 3500;
  var BUFF_TIME = 900;

  function startGraffiti(ctx) {
    var stage = ctx.stage;
    var timers = createTimers();

    // All statements share one grid cell, so the box is always as tall as the longest
    var tags = TEXTS.map(function (text) {
      var p = document.createElement('p');
      p.className = 'bio-tag';
      var words = wordsInto(p, text);
      stage.appendChild(p);
      return { el: p, words: words };
    });

    if (reducedMotion) {
      stage.classList.add('is-static');
      return function stop() {};
    }

    var marker = document.createElement('span');
    marker.className = 'bio-marker';
    var buff = document.createElement('span');
    buff.className = 'bio-buff';
    var roller = document.createElement('span');
    roller.className = 'bio-roller';
    [marker, buff, roller].forEach(function (el) {
      el.setAttribute('aria-hidden', 'true');
      stage.appendChild(el);
    });

    var index = 0;

    function tag() {
      var current = tags[index];
      var paint = GRAFFITI_PAINTS[index % GRAFFITI_PAINTS.length];
      stage.style.setProperty('--paint', paint);
      current.el.classList.add('is-active');
      marker.classList.add('is-writing');

      current.words.forEach(function (word, i) {
        timers.set(function () {
          word.classList.add('is-on');
          placeTool(marker, word, stage, 28);
        }, i * WORD_TIME);
      });

      timers.set(function () {
        marker.classList.remove('is-writing');
        timers.set(buffOut, HOLD_TIME);
      }, current.words.length * WORD_TIME + 200);
    }

    function buffOut() {
      stage.classList.add('is-buffing');

      // Leave a faint ghost under the grey, then clear the wall for the next piece
      timers.set(function () {
        stage.classList.add('is-buffed');
        timers.set(function () {
          var current = tags[index];
          current.el.classList.remove('is-active');
          current.words.forEach(function (word) { word.classList.remove('is-on'); });
          stage.classList.remove('is-buffing', 'is-buffed');
          index = (index + 1) % tags.length;
          timers.set(tag, 300);
        }, 900);
      }, BUFF_TIME);
    }

    tag();

    return function stop() {
      timers.clear();
    };
  }

  // Blueprint: the statements become numbered general notes. Guide lines are ruled for
  // each note, then the pen letters it in; once drawn they stay, like a real drawing
  var LETTER_TIME = 14; // ms per character

  function startBlueprint(ctx) {
    var stage = ctx.stage;
    var timers = createTimers();
    var list = document.createElement('ol');
    list.className = 'bio-notes';
    stage.appendChild(list);

    var notes = TEXTS.map(function (text, i) {
      var li = document.createElement('li');
      var num = document.createElement('span');
      num.className = 'bio-note-num';
      num.textContent = (i + 1) + '.';
      var body = document.createElement('span');
      body.className = 'bio-note-text';
      var words = wordsInto(body, text);
      li.appendChild(num);
      li.appendChild(body);
      list.appendChild(li);
      return { el: li, words: words };
    });

    if (reducedMotion) {
      stage.classList.add('is-static');
      return function stop() {};
    }

    var pen = document.createElement('span');
    pen.className = 'bio-pen';
    pen.setAttribute('aria-hidden', 'true');
    stage.appendChild(pen);

    var delay = 300;
    notes.forEach(function (note) {
      timers.set(function () { note.el.classList.add('is-ruled'); }, delay);
      delay += 350;
      note.words.forEach(function (word) {
        timers.set(function () {
          pen.classList.add('is-writing');
          word.classList.add('is-on');
          placeTool(pen, word, stage);
        }, delay);
        // Longer words take the pen longer to letter
        delay += word.textContent.length * LETTER_TIME + 25;
      });
      delay += 250;
    });

    timers.set(function () { pen.classList.remove('is-writing'); }, delay);

    return function stop() {
      timers.clear();
    };
  }

  var MODES = { graffiti: startGraffiti, blueprint: startBlueprint };

  document.addEventListener('DOMContentLoaded', function () {
    var textEl = document.querySelector('[data-typewriter-text]');
    var cursorEl = document.querySelector('[data-typewriter-cursor]');
    if (!textEl) return;

    var box = textEl.closest('.terminal-box');
    var stage = document.createElement('div');
    stage.className = 'bio-stage';
    if (box) box.appendChild(stage);

    var ctx = { textEl: textEl, cursorEl: cursorEl, stage: stage };
    var stop = null;

    function run() {
      if (stop) stop();
      stage.textContent = '';
      stage.className = 'bio-stage';
      stage.removeAttribute('style');

      var name = MODES[theme()] && box ? theme() : 'neon';
      if (box) box.setAttribute('data-bio', name);
      stop = (MODES[name] || startNeon)(ctx);
    }

    document.addEventListener('themechange', run);
    run();
  });
})();
