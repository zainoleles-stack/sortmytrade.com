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
function goNext(step) {
  if (step === 1) {
    var svc = document.querySelector('input[name="svc"]:checked');
    var pc  = document.getElementById('postcode').value.trim();
    if (!svc) { showToast('Please select a service type'); shake('fs1'); return; }
    if (!pc)  { showToast('Please enter your postcode'); shake('fs1'); return; }
  }
  if (step === 2) {
    var desc = document.getElementById('job-desc').value.trim();
    if (desc.length < 15) { showToast('Please describe your job in a bit more detail'); shake('fs2'); return; }
  }
  document.getElementById('fs' + step).classList.remove('active');
  document.getElementById('fs' + (step + 1)).classList.add('active');
  setProgressStep(step + 1);
  document.getElementById('quote').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function goBack(step) {
  document.getElementById('fs' + step).classList.remove('active');
  document.getElementById('fs' + (step - 1)).classList.add('active');
  setProgressStep(step - 1);
}

function setProgressStep(n) {
  [1, 2, 3].forEach(function(i) {
    var el = document.getElementById('ps' + i);
    el.classList.remove('active', 'done');
    if (i < n)  el.classList.add('done');
    if (i === n) el.classList.add('active');
  });
}

/* ─────────────────────────────────────────
   FORM SUBMIT
───────────────────────────────────────── */
function doSubmit() {
  var name  = document.getElementById('fname').value.trim();
  var phone = document.getElementById('fphone').value.trim();
  var email = document.getElementById('femail').value.trim();

  if (!name)                                { showToast('Please enter your full name'); return; }
  if (phone.replace(/\s/g,'').length < 10)  { showToast('Please enter a valid UK mobile number'); return; }
  if (!email.includes('@'))                 { showToast('Please enter a valid email address'); return; }

  var svcEl = document.querySelector('input[name="svc"]:checked');
  var payload = {
    service:     svcEl ? svcEl.value : '',
    jobType:     document.getElementById('job-type').value,
    postcode:    document.getElementById('postcode').value.trim(),
    description: document.getElementById('job-desc').value.trim(),
    timeline:    document.getElementById('timeline').value,
    budget:      document.getElementById('budget').value,
    name:        name,
    phone:       phone,
    email:       email,
    submitted:   new Date().toISOString(),
    source:      'sortmytrade.com'
  };

  /* Send to Zapier webhook */
  if (ZAPIER_WEBHOOK_URL !== 'YOUR_ZAPIER_WEBHOOK_URL_HERE') {
    fetch(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(function(err) { console.warn('Webhook error:', err); });
  }
function sendToWhatsApp() {
  const name = document.getElementById("name")?.value || "";
  const phone = document.getElementById("phone")?.value || "";
  const postcode = document.getElementById("postcode")?.value || "";
  const service = document.getElementById("service")?.value || "";

  const message = `New quote request:%0A
Name: ${name}%0A
Phone: ${phone}%0A
Postcode: ${postcode}%0A
Service: ${service}`;

  const whatsappNumber = "447700111222"; // replace with your number
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;

  window.open(url, "_blank");
}
  /* ── WhatsApp ping to owner ──────────────────────────────
     Every form submission opens a pre-filled WhatsApp
     message to 07459819603 with the full lead details.
  ────────────────────────────────────────────────────────── */
  var serviceLabels = {
    electrician: 'Electrician',
    manvan:      'Man & Van',
    removals:    'Removals',
    planning:    'Planning Drawings'
  };
  var budgetLabels = {
    unsure:    'Not sure',
    u200:      'Under 200',
    '200-500': '200-500',
    '500-2k':  '500-2k',
    '2kplus':  '2k+'
  };
  var timelineLabels = {
    asap:     'ASAP',
    week:     'Within 1 week',
    month:    'Within 1 month',
    flexible: 'Flexible'
  };

  var waMsg = [
    'NEW LEAD - SortMyTrade',
    '',
    'Service: ' + (serviceLabels[payload.service] || payload.service),
    payload.jobType ? 'Job type: ' + payload.jobType : null,
    'Postcode: ' + payload.postcode,
    'Timeline: ' + (timelineLabels[payload.timeline] || payload.timeline),
    'Budget: ' + (budgetLabels[payload.budget] || payload.budget),
    '',
    'Name: ' + payload.name,
    'Phone: ' + payload.phone,
    'Email: ' + payload.email,
    '',
    'Job description:',
    payload.description
  ].filter(function(l) { return l !== null; }).join('\n');

  window.open('https://wa.me/447459819603?text=' + encodeURIComponent(waMsg), '_blank');

  /* Show success state */
  document.getElementById('fs3').classList.remove('active');
  document.querySelector('.progress-wrap').style.display = 'none';
  document.getElementById('success-panel').style.display = 'block';
  document.getElementById('quote').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

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
