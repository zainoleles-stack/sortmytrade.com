/* ─────────────────────────────────────────
   SORTMYTRADE.COM — main.js
   Replace ZAPIER_WEBHOOK_URL below with
   your actual Zapier webhook to capture leads
───────────────────────────────────────── */

const ZAPIER_WEBHOOK_URL = 'YOUR_ZAPIER_WEBHOOK_URL_HERE';

/* ─────────────────────────────────────────
   SERVICE SUB-TYPES
───────────────────────────────────────── */
const jobTypes = {
  electrician: [
    'Emergency callout',
    'EV charger installation',
    'Full house rewire',
    'Consumer unit / fuse box upgrade',
    'New sockets or lighting',
    'EICR electrical safety certificate',
    'Electric shower installation',
    'Other electrical work'
  ],
  manvan: [
    'Single item collection / delivery',
    'Studio or 1-bed move',
    '2-3 bed property move',
    'Student move',
    'IKEA / flat-pack delivery & assembly',
    'Rubbish or clearance removal',
    'Other'
  ],
  removals: [
    '1-bed flat removal',
    '2-bed house removal',
    '3-bed house removal',
    '4-bed+ house removal',
    'Office or commercial move',
    'Packing service required',
    'Storage needed',
    'Other'
  ],
  planning: [
    'Single-storey extension drawings',
    'Double-storey extension drawings',
    'Loft conversion drawings',
    'Planning permission application',
    'Permitted development advice',
    'Structural drawings only',
    'Other'
  ]
};

document.querySelectorAll('input[name="svc"]').forEach(function(radio) {
  radio.addEventListener('change', function() {
    var subField = document.getElementById('sub-field');
    var sel = document.getElementById('job-type');
    subField.style.display = 'block';
    sel.innerHTML = '<option value="">Select job type...</option>';
    var types = jobTypes[this.value] || [];
    types.forEach(function(t) {
      sel.innerHTML += '<option value="' + t + '">' + t + '</option>';
    });
  });
});

/* ─────────────────────────────────────────
   STEP NAVIGATION
───────────────────────────────────────── */
(function () {
  const form = document.getElementById("leadForm");
  if (!form) return;

  const whatsappNumber = "447459819603";

  function cleanValue(value) {
    return String(value || "").trim();
  }

  function buildMessage(data) {
    return [
      "New SortMyTrade quote request",
      "",
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Postcode: ${data.postcode}`,
      `Service: ${data.service}`,
      `Urgency: ${data.urgency}`
    ].join("\n");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = cleanValue(document.getElementById("name")?.value);
    const phone = cleanValue(document.getElementById("phone")?.value);
    const postcode = cleanValue(document.getElementById("postcode")?.value);
    const service = cleanValue(document.getElementById("service")?.value);
    const urgency = cleanValue(document.getElementById("urgency")?.value);

    if (!name || !phone || !postcode || !service || !urgency) {
      alert("Please complete all fields before requesting your quote.");
      return;
    }

    const message = buildMessage({
      name,
      phone,
      postcode,
      service,
      urgency
    });

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
})();p

/* ─────────────────────────────────────────
   FAQ ACCORDION
───────────────────────────────────────── */
function toggleFaq(btn) {
  var item = btn.parentElement;
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('open'); });
  if (!isOpen) item.classList.add('open');
}

/* ─────────────────────────────────────────
   AREA CHIPS
───────────────────────────────────────── */
document.querySelectorAll('.achip').forEach(function(chip) {
  chip.addEventListener('click', function() {
    document.querySelectorAll('.achip').forEach(function(c) { c.classList.remove('on'); });
    this.classList.add('on');
  });
});

/* ─────────────────────────────────────────
   SMOOTH SCROLL
───────────────────────────────────────── */
function scrollToSection(id) {
  var el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ─────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────── */
var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(function(el) {
  revealObserver.observe(el);
});

/* ─────────────────────────────────────────
   TOAST NOTIFICATION
───────────────────────────────────────── */
function showToast(msg) {
  var t = document.getElementById('smt-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'smt-toast';
    t.style.cssText = [
      'position:fixed','bottom:28px','left:50%',
      'transform:translateX(-50%) translateY(20px)',
      'background:#ef4444','color:#fff','padding:12px 24px',
      'border-radius:6px','font-family:Manrope,sans-serif',
      'font-size:14px','font-weight:600','z-index:9999',
      'opacity:0','transition:all .25s','pointer-events:none',
      'white-space:nowrap','box-shadow:0 8px 32px rgba(0,0,0,.2)'
    ].join(';');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(t._timer);
  t._timer = setTimeout(function() {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(10px)';
  }, 3000);
}

/* ─────────────────────────────────────────
   SHAKE ANIMATION
───────────────────────────────────────── */
function shake(id) {
  var el = document.getElementById(id);
  var i = 0;
  function step() {
    el.style.transform = i % 2 ? 'translateX(-5px)' : 'translateX(5px)';
    i++;
    if (i < 6) setTimeout(step, 70);
    else el.style.transform = '';
  }
  step();
}
