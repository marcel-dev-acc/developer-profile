(function () {
  // Turnstile loads with render=explicit and calls this once ready, so the
  // site key can come from SITE_CONFIG (test key on localhost) rather than
  // being hard-coded in each page's markup.
  window.onTurnstileLoad = function () {
    function renderWidgets() {
      document.querySelectorAll('.cf-turnstile').forEach(function (el) {
        window.turnstile.render(el, {
          sitekey: window.SITE_CONFIG.TURNSTILE_SITE_KEY,
          theme: 'dark',
          size: 'flexible'
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', renderWidgets);
    } else {
      renderWidgets();
    }
  };
})();
