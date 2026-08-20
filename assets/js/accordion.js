(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var items = document.querySelectorAll('.accordion-item');
    items.forEach(function (item) {
      var header = item.querySelector('.accordion-header');
      header.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        item.classList.toggle('open', !isOpen);
        header.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  });
})();
