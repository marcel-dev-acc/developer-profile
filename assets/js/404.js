(function () {
  var BOOT_LINES = [
    { text: 'initiating route lookup...', type: 'neutral' },
    { text: 'checking sitemap... FAILED', type: 'error' },
    { text: 'ERROR 0x404: PAGE_NOT_FOUND', type: 'error' },
    { text: 'rerouting to nearest stable coordinates...', type: 'neutral' },
    { text: 'link re-established', type: 'ok' },
    { text: 'awaiting pilot input', type: 'neutral' }
  ];

  var TYPING_SPEED = 28;
  var LINE_PAUSE = 350;

  function typeLines(container) {
    var lineIndex = 0;

    function nextLine() {
      if (lineIndex >= BOOT_LINES.length) {
        var cursor = document.createElement('span');
        cursor.className = 'cursor';
        cursor.textContent = '▊';
        container.lastElementChild.appendChild(cursor);
        setInterval(function () {
          cursor.classList.toggle('hidden');
        }, 530);
        return;
      }

      var entry = BOOT_LINES[lineIndex];
      var row = document.createElement('div');
      row.className = 'boot-line' + (entry.type === 'error' ? ' is-error' : entry.type === 'ok' ? ' is-ok' : '');

      var arrow = document.createElement('span');
      arrow.className = 'prompt-arrow';
      arrow.textContent = '>';

      var lineText = document.createElement('span');
      lineText.className = 'line-text';

      row.appendChild(arrow);
      row.appendChild(lineText);
      container.appendChild(row);

      var charIndex = 0;
      (function typeChar() {
        if (charIndex <= entry.text.length) {
          lineText.textContent = entry.text.substring(0, charIndex);
          charIndex++;
          setTimeout(typeChar, TYPING_SPEED);
        } else {
          lineIndex++;
          setTimeout(nextLine, LINE_PAUSE);
        }
      })();
    }

    nextLine();
  }

  function startTelemetry(el) {
    function randomCoord(base, range) {
      return (base + (Math.random() - 0.5) * range).toFixed(4);
    }

    function tick() {
      el.textContent =
        'LAT ' + randomCoord(41.4, 4) + '°  ' +
        'LON ' + randomCoord(-73.4, 4) + '°  ' +
        'SIGNAL ' + Math.floor(Math.random() * 40) + '%  ' +
        'STATUS: ERR';
    }

    tick();
    setInterval(tick, 900);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var bootContainer = document.querySelector('[data-boot-lines]');
    if (bootContainer) {
      typeLines(bootContainer);
    }

    var telemetryEl = document.querySelector('[data-telemetry]');
    if (telemetryEl) {
      startTelemetry(telemetryEl);
    }
  });
})();
