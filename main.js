/* ─────────────────────────────────────────
   SORTMYTRADE.COM — main.js
   Updated launch version
───────────────────────────────────────── */

const ZAPIER_WEBHOOK_URL = 'YOUR_ZAPIER_WEBHOOK_URL_HERE';
const WHATSAPP_NUMBER = '447459819603';
 
/* ─────────────────────────────────────────
   SERVICE SUB-TYPES
───────────────────────────────────────── */
const jobTypes = {
  plumber: [
    'Emergency leak repair',
    'Blocked drain',
    'Boiler issue',
    'Tap or toilet repair',
    'Radiator installation or repair',
    'Pipe repair',
    'Bathroom plumbing',
    'Other plumbing work'
  ],
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
  handyman: [
    'Flat-pack furniture assembly',
    'TV mounting',
    'Curtain pole or blind fitting',
    'Wall hanging / shelves',
    'Minor repairs',
    'Painting touch-ups',
    'General odd jobs',
    'Other handyman work'
  ]
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function byId(id) {
  return document.getElementById(id);
}

function cleanValue(value) {
  return String(value || '').trim();
}

function selectedService() {
  const checked = document.querySelector('input[name="svc"]:checked');
  return checked ? checked.value : '';
}

function titleCaseService(value) {
  const map = {
    plumber: 'Plumber',
    electrician: 'Electrician',
    manvan: 'Man & Van',
    removals: 'Removals',
    handyman: 'Handyman'
  };
  return map[value] || value;
}

function currentFiles() {
  const input = byId('job-photos');
  return input && input.files ? Array.from(input.files) : [];
}

function photoNamesText() {
  const files = currentFiles();
  if (!files.length) return 'None';
  return files.map(file => file.name).join(', ');
}

function looksLikeWebhookSet() {
  return ZAPIER_WEBHOOK_URL && !ZAPIER_WEBHOOK_URL.includes('YOUR_ZAPIER_WEBHOOK_URL_HERE');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUkMobile(phone) {
  const cleaned = phone.replace(/\s+/g, '');
  return /^(?:\+44|0)7\d{9}$/.test(cleaned);
}

/* ─────────────────────────────────────────
   TOAST
───────────────────────────────────────── */
function showToast(msg, type = 'error') {
  let t = byId('smt-toast');

  if (!t) {
    t = document.createElement('div');
    t.id = 'smt-toast';
    t.style.cssText = [
      'position:fixed',
      'bottom:28px',
      'left:50%',
      'transform:translateX(-50%) translateY(20px)',
      'color:#fff',
      'padding:12px 24px',
      'border-radius:10px',
      'font-family:Manrope,sans-serif',
      'font-size:14px',
      'font-weight:700',
      'z-index:9999',
      'opacity:0',
      'transition:all .25s ease',
      'pointer-events:none',
      'white-space:nowrap',
      'box-shadow:0 12px 32px rgba(0,0,0,.18)'
    ].join(';');
    document.body.appendChild(t);
  }

  t.style.background = type === 'success' ? '#16a34a' : '#ef4444';
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';

  clearTimeout(t._timer);
  t._timer = setTimeout(function () {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(10px)';
  }, 2800);
}

/* ─────────────────────────────────────────
   SHAKE
───────────────────────────────────────── */
function shake(id) {
  const el = byId(id);
  if (!el) return;

  let i = 0;

  function step() {
    el.style.transform = i % 2 ? 'translateX(-5px)' : 'translateX(5px)';
    i += 1;
    if (i < 6) {
      setTimeout(step, 65);
    } else {
      el.style.transform = '';
    }
  }

  step();
}

/* ─────────────────────────────────────────
   SERVICE SUBTYPE POPULATION
───────────────────────────────────────── */
function populateJobTypes(serviceValue) {
  const subField = byId('sub-field');
  const sel = byId('job-type');
  if (!subField || !sel) return;

  const types = jobTypes[serviceValue] || [];
  sel.innerHTML = '<option value="">Select...</option>';

  types.forEach(function (t) {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    sel.appendChild(opt);
  });

  subField.style.display = types.length ? 'block' : 'none';
}

/* ─────────────────────────────────────────
   STEP NAVIGATION
───────────────────────────────────────── */
function setProgress(step) {
  ['ps1', 'ps2', 'ps3'].forEach(function (id, index) {
    const el = byId(id);
    if (!el) return;

    el.classList.remove('active', 'done');

    const num = index + 1;
    if (num < step) el.classList.add('done');
    if (num === step) el.classList.add('active');
  });
}

function showStep(step) {
  ['fs1', 'fs2', 'fs3'].forEach(function (id, index) {
    const el = byId(id);
    if (!el) return;

    el.classList.remove('active');
    if (index + 1 === step) el.classList.add('active');
  });

  setProgress(step);
}

function validateStep1() {
  const service = selectedService();
  const postcode = cleanValue(byId('postcode')?.value);
  const jobType = cleanValue(byId('job-type')?.value);
  const subField = byId('sub-field');

  if (!service) {
    showToast('Please select a service.');
    shake('fs1');
    return false;
  }

  if (subField && subField.style.display !== 'none' && !jobType) {
    showToast('Please select the specific job type.');
    shake('job-type');
    return false;
  }

  if (!postcode) {
    showToast('Please enter your postcode.');
    shake('postcode');
    return false;
  }

  return true;
}

function validateStep2() {
  const desc = cleanValue(byId('job-desc')?.value);

  if (!desc) {
    showToast('Please describe the job.');
    shake('job-desc');
    return false;
  }

  return true;
}

function validateStep3() {
  const name = cleanValue(byId('fname')?.value);
  const phone = cleanValue(byId('fphone')?.value);
  const email = cleanValue(byId('femail')?.value);

  if (!name) {
    showToast('Please enter your full name.');
    shake('fname');
    return false;
  }

  if (!phone) {
    showToast('Please enter your mobile number.');
    shake('fphone');
    return false;
  }

  if (!isValidUkMobile(phone)) {
    showToast('Please enter a valid UK mobile number.');
    shake('fphone');
    return false;
  }

  if (!email) {
    showToast('Please enter your email address.');
    shake('femail');
    return false;
  }

  if (!isValidEmail(email)) {
    showToast('Please enter a valid email address.');
    shake('femail');
    return false;
  }

  return true;
}

function goNext(step) {
  if (step === 1 && !validateStep1()) return;
  if (step === 2 && !validateStep2()) return;
  showStep(step + 1);
}

function goBack(step) {
  showStep(step - 1);
}

/* ─────────────────────────────────────────
   BUILD LEAD DATA
───────────────────────────────────────── */
function buildLeadData() {
  return {
    service: titleCaseService(selectedService()),
    jobType: cleanValue(byId('job-type')?.value),
    postcode: cleanValue(byId('postcode')?.value),
    description: cleanValue(byId('job-desc')?.value),
    timeline: cleanValue(byId('timeline')?.value),
    budget: cleanValue(byId('budget')?.value),
    fullName: cleanValue(byId('fname')?.value),
    phone: cleanValue(byId('fphone')?.value),
    email: cleanValue(byId('femail')?.value),
    photoNames: photoNamesText(),
    submittedAt: new Date().toISOString()
  };
}

function buildWhatsAppMessage(data) {
  return [
    'New SortMyTrade quote request',
    '',
    `Name: ${data.fullName}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Postcode: ${data.postcode}`,
    `Service: ${data.service}`,
    `Job type: ${data.jobType || 'Not specified'}`,
    `Timeline: ${data.timeline || 'Not specified'}`,
    `Budget: ${data.budget || 'Not specified'}`,
    `Photos: ${data.photoNames}`,
    '',
    'Job description:',
    data.description || 'Not provided'
  ].join('\n');
}

/* ─────────────────────────────────────────
   WEBHOOK SEND
───────────────────────────────────────── */
async function sendLeadToWebhook(data) {
  if (!looksLikeWebhookSet()) return false;

  try {
    const formData = new FormData();

    formData.append('service', data.service);
    formData.append('jobType', data.jobType);
    formData.append('postcode', data.postcode);
    formData.append('description', data.description);
    formData.append('timeline', data.timeline);
    formData.append('budget', data.budget);
    formData.append('fullName', data.fullName);
    formData.append('phone', data.phone);
    formData.append('email', data.email);
    formData.append('photoNames', data.photoNames);
    formData.append('submittedAt', data.submittedAt);

    currentFiles().forEach(function (file, index) {
      formData.append(`photo_${index + 1}`, file);
    });

    const response = await fetch(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      body: formData
    });

    return response.ok;
  } catch (error) {
    console.error('Webhook send failed:', error);
    return false;
  }
}

/* ─────────────────────────────────────────
   SUBMIT
───────────────────────────────────────── */
async function doSubmit() {
  if (!validateStep3()) return;

  const data = buildLeadData();
  const submitBtn = document.querySelector('.btn-submit');

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.style.cursor = 'not-allowed';
  }

  const webhookOk = await sendLeadToWebhook(data);
  const message = buildWhatsAppMessage(data);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  const fs3 = byId('fs3');
  const successPanel = byId('success-panel');

  if (fs3) fs3.classList.remove('active');
  if (successPanel) {
    successPanel.style.display = 'block';
    successPanel.classList.add('active');
  }

  setProgress(3);

  if (webhookOk) {
    showToast('Request submitted. Opening WhatsApp now...', 'success');
  } else {
    showToast('Opening WhatsApp to finish your request...', 'success');
  }

  window.open(url, '_blank', 'noopener,noreferrer');

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.style.cursor = 'pointer';
  }
}

/* ─────────────────────────────────────────
   FAQ ACCORDION
───────────────────────────────────────── */
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains('open');

  document.querySelectorAll('.faq-item').forEach(function (i) {
    i.classList.remove('open');
  });

  if (!isOpen) item.classList.add('open');
}

/* ─────────────────────────────────────────
   AREA CHIPS
───────────────────────────────────────── */
function bindAreaChips() {
  document.querySelectorAll('.achip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.achip').forEach(function (c) {
        c.classList.remove('on');
      });
      chip.classList.add('on');
    });
  });
}

/* ─────────────────────────────────────────
   SMOOTH SCROLL
───────────────────────────────────────── */
function scrollToSection(id) {
  const el = byId(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ─────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────── */
function initReveal() {
  if (!('IntersectionObserver' in window)) return;

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });
}

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  showStep(1);

  const subField = byId('sub-field');
  if (subField) subField.style.display = 'none';

  document.querySelectorAll('input[name="svc"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      populateJobTypes(this.value);
    });
  });

  bindAreaChips();
  initReveal();
});
