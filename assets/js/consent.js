/*
 * Cookie consent (see COOKIE_IMPLEMENTATION.md). Loaded in <head> on every page, after theme.js.
 *
 * - Necessary storage is always on; "Statistics and analytics" (Google Analytics) is off until the
 *   visitor switches it on. Google Analytics is never in the page markup: it's injected here, and
 *   only once the visitor has said yes.
 * - The choice is kept in localStorage as {version, analytics, decidedAt} and asked for again after
 *   12 months or when CONSENT_VERSION changes.
 * - Closing the panel without choosing saves nothing, so it opens again on the next page load.
 * - Any [data-cookie-settings] link reopens the panel. window.cookieConsent exposes the same.
 */
(function () {
  var STORAGE_KEY = 'cookie-consent';
  var CONSENT_VERSION = 1; // bump when the categories, or what they cover, change
  var MAX_AGE = 365 * 24 * 60 * 60 * 1000; // ask again after 12 months
  var GA_MEASUREMENT_ID = 'G-JNW4R9ZHN8';

  // Three states: the choice hasn't been read yet (null), the visitor hasn't chosen (false),
  // or their stored record. Analytics cookies are only ever cleared once it has been read.
  var choice = null;
  var gaLoaded = false;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function readChoice() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      var record = JSON.parse(raw);
      var valid = record && record.version === CONSENT_VERSION &&
        typeof record.analytics === 'boolean' &&
        typeof record.decidedAt === 'number' &&
        Date.now() - record.decidedAt < MAX_AGE;
      return valid ? record : false;
    } catch (e) {
      return false;
    }
  }

  // Without storage (private windows, blocked site data) the choice lasts for this visit only
  function storeChoice(analytics) {
    choice = { version: CONSENT_VERSION, analytics: analytics, decidedAt: Date.now() };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
    } catch (e) { /* keep it in memory */ }
  }

  function analyticsAllowed() {
    return !!(choice && choice.analytics);
  }

  // ---- Google Analytics ----

  function loadAnalytics() {
    window['ga-disable-' + GA_MEASUREMENT_ID] = false;
    if (gaLoaded) return;
    gaLoaded = true;

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  }

  // Google's opt-out flag stops an already-loaded tag from sending anything, then the cookies go.
  // GA sets them on the top-level domain, so each is expired on the host and every parent domain.
  function stopAnalytics() {
    window['ga-disable-' + GA_MEASUREMENT_ID] = true;

    var names = document.cookie
      .split(';')
      .map(function (cookie) { return cookie.split('=')[0].trim(); })
      .filter(function (name) { return /^_g(a|id|at)(_|$)/.test(name); });
    var parts = window.location.hostname.split('.');

    names.forEach(function (name) {
      document.cookie = name + '=; Max-Age=0; path=/';
      for (var i = 0; i < parts.length - 1; i++) {
        document.cookie = name + '=; Max-Age=0; path=/; domain=.' + parts.slice(i).join('.');
      }
    });
  }

  function applyChoice() {
    if (analyticsAllowed()) {
      loadAnalytics();
    } else {
      stopAnalytics(); // also clears anything left by an earlier setup
    }
  }

  // Read the stored choice and act on it straight away, before the page renders
  choice = readChoice();
  applyChoice();

  // ---- Panel ----

  var panel = null;
  var analyticsSwitch = null;
  var lastFocus = null;

  // The site root is wherever this script's assets/ folder lives, so the link works from any page
  var SITE_ROOT = (document.currentScript && document.currentScript.src || '').replace(/assets\/js\/consent\.js.*$/, '') || '/';

  function privacyHref() {
    return SITE_ROOT + 'privacy/#cookies';
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function category(id, title, description, opts) {
    var card = el('div', 'cc-card');
    var head = el('div', 'cc-card-head');
    var label = el('label', 'cc-card-title', title);
    label.setAttribute('for', id);

    var switchWrap = el('span', 'cc-switch');
    var input = el('input');
    input.type = 'checkbox';
    input.id = id;
    input.setAttribute('role', 'switch');
    input.checked = !!opts.checked;
    if (opts.locked) {
      input.disabled = true;
      input.setAttribute('aria-describedby', id + '-state');
    }
    switchWrap.appendChild(input);
    switchWrap.appendChild(el('span', 'cc-switch-track')).setAttribute('aria-hidden', 'true');

    head.appendChild(label);
    if (opts.locked) {
      var state = el('span', 'cc-card-state', 'Always on');
      state.id = id + '-state';
      head.appendChild(state);
    }
    head.appendChild(switchWrap);

    card.appendChild(head);
    card.appendChild(el('p', 'cc-card-text', description));
    return { card: card, input: input };
  }

  function buildPanel() {
    panel = el('div', 'cc-root');
    panel.hidden = true;

    var backdrop = el('div', 'cc-backdrop');
    backdrop.setAttribute('data-cc-close', '');

    var sheet = el('div', 'cc-sheet');
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-labelledby', 'cc-title');
    sheet.setAttribute('aria-describedby', 'cc-subtitle');

    var handle = el('div', 'cc-handle');
    handle.setAttribute('aria-hidden', 'true');

    var header = el('div', 'cc-header');
    var headings = el('div');
    var title = el('h2', 'cc-title', 'Cookie settings');
    title.id = 'cc-title';
    var subtitle = el('p', 'cc-subtitle', 'Choose whether we can count visits to improve the site.');
    subtitle.id = 'cc-subtitle';
    headings.appendChild(title);
    headings.appendChild(subtitle);

    var close = el('button', 'cc-close');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close cookie settings');
    close.setAttribute('data-cc-close', '');
    close.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line></svg>';

    header.appendChild(headings);
    header.appendChild(close);

    var intro = el('p', 'cc-intro', 'Necessary cookies keep the site secure and working, so they are always on. ' +
      'Analytics stays off unless you switch it on, and you can change your mind at any time from ' +
      '"Cookie settings" at the bottom of every page.');

    var cards = el('div', 'cc-cards');
    var necessary = category('cc-necessary', 'Necessary',
      'Cloudflare protects the site and checks that the contact form is sent by a person ' +
      '(Cloudflare Turnstile, on that page only). Your browser also keeps your theme and this choice.',
      { checked: true, locked: true });
    var analytics = category('cc-analytics', 'Statistics and analytics',
      'Google Analytics counts visits and the pages people view, so we can see what’s useful. ' +
      'It sets the _ga cookies and only loads if you switch this on.', { checked: analyticsAllowed() });
    analyticsSwitch = analytics.input;
    cards.appendChild(necessary.card);
    cards.appendChild(analytics.card);

    var actions = el('div', 'cc-actions');
    var reject = el('button', 'btn-glow cc-btn', 'Reject all');
    reject.type = 'button';
    var save = el('button', 'btn-glow cc-btn', 'Save my choices');
    save.type = 'button';
    var accept = el('button', 'btn-pill cc-btn cc-btn-accept', 'Accept all');
    accept.type = 'button';
    var policy = el('a', 'cc-policy', 'Privacy and cookies policy');
    policy.href = privacyHref();
    policy.setAttribute('data-cc-close', '');

    reject.addEventListener('click', function () { decide(false); });
    save.addEventListener('click', function () { decide(analyticsSwitch.checked); });
    accept.addEventListener('click', function () { decide(true); });

    actions.appendChild(reject);
    actions.appendChild(save);
    actions.appendChild(accept);
    actions.appendChild(policy);

    sheet.appendChild(handle);
    sheet.appendChild(header);
    sheet.appendChild(intro);
    sheet.appendChild(cards);
    sheet.appendChild(actions);

    panel.appendChild(backdrop);
    panel.appendChild(sheet);
    document.body.appendChild(panel);

    // The policy link closes without saving and then follows the link as normal
    panel.addEventListener('click', function (event) {
      if (event.target.closest('[data-cc-close]')) closePanel();
    });

    panel.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePanel();
      } else if (event.key === 'Tab') {
        trapFocus(event, sheet);
      }
    });

    enableSwipe(sheet, handle);
  }

  function focusables(container) {
    return Array.prototype.filter.call(
      container.querySelectorAll('button, a[href], input:not([disabled])'),
      function (node) { return node.offsetParent !== null; }
    );
  }

  function trapFocus(event, container) {
    var items = focusables(container);
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  // Phones: drag the sheet down by its handle (or the header) to close it
  function enableSwipe(sheet, handle) {
    var startY = null;
    var dy = 0;

    function start(event) {
      if (!window.matchMedia('(max-width: 639px)').matches) return;
      startY = event.touches[0].clientY;
      dy = 0;
      sheet.classList.add('is-dragging');
    }

    function move(event) {
      if (startY === null) return;
      dy = Math.max(0, event.touches[0].clientY - startY);
      sheet.style.transform = 'translateY(' + dy + 'px)';
    }

    function end() {
      if (startY === null) return;
      startY = null;
      sheet.classList.remove('is-dragging');
      sheet.style.transform = '';
      if (dy > 80) closePanel();
    }

    [handle, sheet.querySelector('.cc-header')].forEach(function (area) {
      area.addEventListener('touchstart', start, { passive: true });
      area.addEventListener('touchmove', move, { passive: true });
      area.addEventListener('touchend', end);
      area.addEventListener('touchcancel', end);
    });
  }

  function openPanel() {
    if (!panel) buildPanel();
    analyticsSwitch.checked = analyticsAllowed();
    lastFocus = document.activeElement;
    panel.hidden = false;
    document.documentElement.classList.add('cc-open');
    // Reading the layout commits the hidden position, so the slide-up transition runs from there
    void panel.offsetWidth;
    panel.classList.add('is-open');
    var first = panel.querySelector('.cc-btn');
    if (first) first.focus({ preventScroll: true });
  }

  function closePanel() {
    if (!panel || panel.hidden) return;
    panel.classList.remove('is-open');
    document.documentElement.classList.remove('cc-open');
    var finish = function () { panel.hidden = true; };
    if (reducedMotion) finish(); else setTimeout(finish, 350);
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus({ preventScroll: true });
  }

  function decide(analytics) {
    storeChoice(analytics);
    applyChoice();
    closePanel();
  }

  window.cookieConsent = {
    get analytics() { return analyticsAllowed(); },
    openSettings: openPanel
  };

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-cookie-settings]');
    if (!trigger) return;
    event.preventDefault();
    openPanel();
  });

  document.addEventListener('DOMContentLoaded', function () {
    if (!choice) openPanel();
  });
})();
