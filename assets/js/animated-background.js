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
  }

  document.addEventListener('DOMContentLoaded', function () {
    var container = document.querySelector('.animated-bg');
    if (container) {
      initAnimatedBackground(container);
    }
  });
})();
