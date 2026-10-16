(function () {
  function initAnimatedBackground(container) {
    var grid = document.createElement('div');
    grid.className = 'bg-grid';
    container.appendChild(grid);

    var particles = document.createElement('div');
    for (var i = 0; i < 20; i++) {
      var particle = document.createElement('div');
      particle.className = 'bg-particle';
      particle.style.left = (Math.random() * 100) + '%';
      particle.style.top = (Math.random() * 100) + '%';
      particle.style.animation = 'float ' + (5 + Math.random() * 10) + 's ease-in-out infinite';
      particle.style.animationDelay = (Math.random() * 5) + 's';
      particles.appendChild(particle);
    }
    container.appendChild(particles);

    var orb1 = document.createElement('div');
    orb1.className = 'bg-orb bg-orb-1';
    container.appendChild(orb1);

    var orb2 = document.createElement('div');
    orb2.className = 'bg-orb bg-orb-2';
    container.appendChild(orb2);

    // Paint running down the wall; only shown by the graffiti theme
    var drips = document.createElement('div');
    drips.className = 'bg-drips';
    for (var j = 0; j < 9; j++) {
      var drip = document.createElement('div');
      drip.className = 'bg-drip';
      drip.style.left = (4 + j * 11 + Math.random() * 6) + '%';
      drip.style.setProperty('--drip-length', (18 + Math.random() * 40) + 'vh');
      drip.style.setProperty('--drip-width', (5 + Math.random() * 7) + 'px');
      drip.style.animationDuration = (9 + Math.random() * 8) + 's';
      drip.style.animationDelay = -(Math.random() * 12) + 's';
      drips.appendChild(drip);
    }
    container.appendChild(drips);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var container = document.querySelector('.animated-bg');
    if (container) {
      initAnimatedBackground(container);
    }
  });
})();
