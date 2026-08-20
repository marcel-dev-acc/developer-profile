(function () {
  var TEXTS = [
    "Seasoned Senior Software Developer delivering secure, fault-tolerant solutions across mobile, web, backend, and infrastructure.",
    "I work closely with clients on requirements and solution architecture, then lead testing, documentation, and handover to ensure reliable delivery.",
    "I mentor engineers, run React Native knowledge-sharing, and champion continuous learning and security-focused engineering practices."
  ];

  var TYPING_SPEED = 50;
  var DELETING_SPEED = 30;
  var PAUSE_TIME = 3000;

  document.addEventListener('DOMContentLoaded', function () {
    var textEl = document.querySelector('[data-typewriter-text]');
    var cursorEl = document.querySelector('[data-typewriter-cursor]');
    if (!textEl) return;

    var currentTextIndex = 0;
    var displayedText = '';
    var isDeleting = false;

    function scheduleNext() {
      var currentText = TEXTS[currentTextIndex];

      if (!isDeleting && displayedText === currentText) {
        setTimeout(function () {
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

      setTimeout(function () {
        displayedText = isDeleting
          ? currentText.substring(0, displayedText.length - 1)
          : currentText.substring(0, displayedText.length + 1);
        textEl.textContent = displayedText;
        scheduleNext();
      }, isDeleting ? DELETING_SPEED : TYPING_SPEED);
    }

    scheduleNext();

    if (cursorEl) {
      setInterval(function () {
        cursorEl.classList.toggle('hidden');
      }, 530);
    }
  });
})();
