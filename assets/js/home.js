(function () {
  function calculateExperience() {
    var startDate = new Date(2016, 0, 1);
    var currentDate = new Date();

    var years = currentDate.getFullYear() - startDate.getFullYear();
    var months = currentDate.getMonth() - startDate.getMonth();

    var totalMonths = years * 12 + months;
    var experienceYears = Math.floor(totalMonths / 12);
    var experienceMonths = totalMonths % 12;

    return experienceYears + ' years ' + experienceMonths + ' months';
  }

  function initNeonFlicker() {
    var content = document.querySelector('[data-neon-content]');
    var title = document.querySelector('[data-neon-title]');
    var subtitle = document.querySelector('[data-neon-subtitle]');
    if (!content) return;

    var flickerSequence = [
      { delay: 0, visible: false },
      { delay: 100, visible: true },
      { delay: 150, visible: false },
      { delay: 200, visible: true },
      { delay: 250, visible: false },
      { delay: 400, visible: true },
      { delay: 450, visible: false },
      { delay: 500, visible: true },
      { delay: 600, visible: false },
      { delay: 650, visible: true }
    ];

    flickerSequence.forEach(function (step) {
      setTimeout(function () {
        content.classList.toggle('visible', step.visible);
      }, step.delay);
    });

    setTimeout(function () {
      content.classList.add('visible');
      if (title) title.classList.add('flicker');
      if (subtitle) subtitle.classList.add('flicker');
    }, 1000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var experienceEl = document.querySelector('[data-experience]');
    if (experienceEl) {
      experienceEl.textContent = calculateExperience();
    }
    initNeonFlicker();
  });
})();
