(function () {
  var LOCAL_HOSTS = ['localhost', '127.0.0.1', '[::1]'];
  var isLocal = LOCAL_HOSTS.indexOf(window.location.hostname) !== -1;

  window.SITE_CONFIG = {
    // Locally, use Cloudflare's "always passes" test site key so the widget
    // works off the production domain. See
    // https://developers.cloudflare.com/turnstile/troubleshooting/testing/
    TURNSTILE_SITE_KEY: isLocal ? '1x00000000000000000000AA' : '0x4AAAAAAEOzS56m0M5xjAFe',
    CONTACT_ENDPOINT: 'https://mjhub-cloudflare-proxy.mjhubandservices.workers.dev/contact',
    // CONTACT_ENDPOINT: 'http://localhost:7071/contact',
    ORGANISATION_ID: '2c4d46bb-611b-463a-9cd4-1486a755850a'
  };
})();
