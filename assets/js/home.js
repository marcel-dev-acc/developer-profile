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

  function initOfferProgress() {
    var progress = document.querySelector('[data-offer-progress]');
    if (!progress) return;

    var totalSpots = 50;
    // Spots fill linearly from the start date until the offer ends at the close of 31 July 2027
    var startDate = new Date(2026, 6, 11);
    var endDate = new Date(2027, 6, 31, 23, 59, 59);
    var now = new Date();

    var elapsed = (now - startDate) / (endDate - startDate);
    var fraction = Math.min(Math.max(elapsed, 0), 1);
    var claimed = Math.min(Math.round(fraction * totalSpots), totalSpots);
    var remaining = totalSpots - claimed;
    var percent = (claimed / totalSpots) * 100;

    var claimedEl = progress.querySelector('[data-offer-claimed]');
    var totalEl = progress.querySelector('[data-offer-total]');
    var fillEl = progress.querySelector('[data-offer-fill]');
    var noteEl = progress.querySelector('[data-offer-note]');
    var trackEl = progress.querySelector('[role="progressbar"]');

    if (claimedEl) claimedEl.textContent = claimed;
    if (totalEl) totalEl.textContent = totalSpots;
    if (fillEl) fillEl.style.width = percent + '%';
    if (trackEl) {
      trackEl.setAttribute('aria-valuemax', totalSpots);
      trackEl.setAttribute('aria-valuenow', claimed);
    }
    if (noteEl) {
      if (now > endDate) {
        noteEl.textContent = 'This offer ended on 31 July 2027.';
      } else {
        noteEl.textContent = 'Limited to the first ' + totalSpots + ' customers. ' +
          remaining + (remaining === 1 ? ' spot' : ' spots') + ' left. Offer ends 31 July 2027.';
      }
    }
  }

  function initSectionNav() {
    var sections = document.querySelectorAll('[data-section]');
    var links = document.querySelectorAll('[data-section-link]');
    if (!sections.length || !links.length) return;

    var ticking = false;

    function setActive(id) {
      links.forEach(function (link) {
        var isActive = link.getAttribute('data-section-link') === id;
        link.classList.toggle('active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    // The active section is the last one whose top has passed a line 40% down the viewport,
    // so the profile stays active from the top of the page until the first content section
    function update() {
      ticking = false;
      var line = window.innerHeight * 0.4;
      var activeId = sections[0].id;

      sections.forEach(function (section) {
        if (section.getBoundingClientRect().top <= line) activeId = section.id;
      });

      // Short final section: activate it once the page is scrolled to the bottom
      var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) activeId = sections[sections.length - 1].id;

      setActive(activeId);
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

  document.addEventListener('DOMContentLoaded', function () {
    var experienceEl = document.querySelector('[data-experience]');
    if (experienceEl) {
      experienceEl.textContent = calculateExperience();
    }
    // On mobile the call to action flickers on once the name has mostly resolved, rather than alongside it
    if (document.documentElement.classList.contains('fx-stagger')) {
      setTimeout(initNeonFlicker, 900);
    } else {
      initNeonFlicker();
    }
    initOfferProgress();
    initSectionNav();
  });
})();
