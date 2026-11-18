/* SortMyTrade — consent banner, Google Ads conversions and ad click IDs.
   Loaded on index.html and bathrooms.html, after the Google tag in <head>.

   - Ad cookies stay off until the visitor accepts (Google Consent Mode).
   - smt.conv('lead')      -> "Submit lead form" conversion (a form was sent)
   - smt.conv('whatsapp')  -> "Request quote" conversion (a WhatsApp link was tapped)
   - smt.clickIds()        -> {gclid, gbraid, wbraid} from the ad click, sent with each
                              lead so won jobs can be uploaded back to Google Ads.
   - Links with data-no-track (e.g. trade recruitment) are not counted as leads. */
(function () {
  var AW = 'AW-18396685081';
  var LABELS = { lead: 'Uh1pCLqD6qMdEJnGnMRE', whatsapp: 'EfuLCLr66aMdEJnGnMRE' };
  var CONSENT_KEY = 'smt_consent';
  var CLICK_KEY = 'smt_click';
  var CLICK_TTL = 90 * 864e5; // Google Ads accepts click uploads up to 90 days after the click

  function get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }
  function del(k) { try { window.localStorage.removeItem(k); } catch (e) {} }
  function granted() { return get(CONSENT_KEY) === 'granted'; }

  function updateConsent(on) {
    if (typeof gtag !== 'function') return;
    var v = on ? 'granted' : 'denied';
    gtag('consent', 'update', { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
  }

  /* Ad click IDs: read from the landing URL; only kept between visits with consent. */
  var urlIds = {};
  try {
    var q = new URLSearchParams(window.location.search);
    ['gclid', 'gbraid', 'wbraid'].forEach(function (k) { var v = q.get(k); if (v) urlIds[k] = v; });
  } catch (e) {}
  function keepIds() {
    if (Object.keys(urlIds).length && granted()) set(CLICK_KEY, JSON.stringify({ ids: urlIds, t: Date.now() }));
  }
  keepIds();
  function clickIds() {
    if (Object.keys(urlIds).length) return urlIds;
    try {
      var d = JSON.parse(get(CLICK_KEY) || 'null');
      if (d && Date.now() - d.t < CLICK_TTL) return d.ids;
    } catch (e) {}
    return {};
  }

  function conv(kind) {
    if (typeof gtag !== 'function' || !LABELS[kind]) return;
    gtag('event', 'conversion', { send_to: AW + '/' + LABELS[kind], transport_type: 'beacon' });
  }

  /* Any WhatsApp link tapped counts once as a quote request. */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href*="wa.me/"]') : null;
    if (a && !a.hasAttribute('data-no-track')) conv('whatsapp');
  }, true);

  /* Consent banner */
  var css =
    '#smt-consent{position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;max-width:560px;margin:0 auto;' +
    'background:#0B0F14;color:#DCE5DF;border-radius:12px;padding:16px 18px;box-shadow:0 12px 40px rgba(0,0,0,.35);' +
    'font:14px/1.5 "DM Sans",system-ui,-apple-system,sans-serif}' +
    '#smt-consent p{margin:0 0 12px}#smt-consent a{color:#5FE0A8;text-decoration:underline}' +
    '#smt-consent .row{display:flex;gap:10px}' +
    '#smt-consent button{flex:1;font:600 14px "DM Sans",system-ui,sans-serif;padding:11px 14px;border-radius:8px;cursor:pointer;' +
    'border:1px solid rgba(255,255,255,.35);background:transparent;color:#fff}' +
    '#smt-consent button:focus-visible{outline:2px solid #5FE0A8;outline-offset:2px}';

  function hide() { var el = document.getElementById('smt-consent'); if (el) el.remove(); }
  function choose(on) {
    set(CONSENT_KEY, on ? 'granted' : 'denied');
    updateConsent(on);
    if (on) keepIds(); else del(CLICK_KEY);
    hide();
  }
  function show() {
    if (document.getElementById('smt-consent')) return;
    if (!document.getElementById('smt-consent-css')) {
      var s = document.createElement('style'); s.id = 'smt-consent-css'; s.textContent = css;
      document.head.appendChild(s);
    }
    var box = document.createElement('div');
    box.id = 'smt-consent';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Cookie choices');
    box.innerHTML =
      '<p>We use cookies to see which of our Google ads bring enquiries. Nothing is set unless you accept. ' +
      '<a href="privacy.html#cookies">How we use your data</a></p>' +
      '<div class="row"><button type="button" data-c="0">Reject</button><button type="button" data-c="1">Accept</button></div>';
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-c]');
      if (b) choose(b.getAttribute('data-c') === '1');
    });
    document.body.appendChild(box);
  }

  function init() {
    var c = get(CONSENT_KEY);
    if (c !== 'granted' && c !== 'denied') show();
    document.addEventListener('click', function (e) {
      var l = e.target.closest ? e.target.closest('[data-cookie-settings]') : null;
      if (l) { e.preventDefault(); show(); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.smt = { conv: conv, clickIds: clickIds, openConsent: show };
})();
