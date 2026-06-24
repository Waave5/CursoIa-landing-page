(function () {
  var COOKIE_NAME = 'ab_variant';
  var COOKIE_DAYS = 30;

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function setCookie(name, value, days) {
    var expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + value + '; expires=' + expires + '; path=/; SameSite=Lax';
  }

  var existingVariant = getCookie(COOKIE_NAME);
  var variant = existingVariant;

  if (!variant) {
    // variant = Math.random() < 0.5 ? 'a' : 'b';
    variant = 'a';
    setCookie(COOKIE_NAME, variant, COOKIE_DAYS);
  }

  window.__abVariant = variant;

  var path = window.location.pathname;
  var isLanding = path === '/' || path === '/index.html' || path === '/ai' || path === '/ai/';

  // First-time B users: reload so Vercel rewrite serves Version B
  if (!existingVariant && variant === 'b' && isLanding) {
    window.location.replace(path);
    return;
  }

  if (typeof gtag === 'function') {
    gtag('event', 'ab_test_assignment', {
      event_category: 'experiment',
      event_label: 'landing_page_variant_' + variant,
      ab_variant: variant,
      non_interaction: true
    });
    gtag('set', { ab_variant: variant });
  }
})();
