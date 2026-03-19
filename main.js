@@ -1,14 +1,10 @@
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
@@ -61,9 +57,6 @@ const jobTypes = {
  ]
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function byId(id) {
  return document.getElementById(id);
}
@@ -112,9 +105,6 @@ function isValidUkMobile(phone) {
  return /^(?:\+44|0)7\d{9}$/.test(cleaned);
}

/* ─────────────────────────────────────────
   TOAST
───────────────────────────────────────── */
function showToast(msg, type = 'error') {
  let t = byId('smt-toast');

@@ -154,9 +144,6 @@ function showToast(msg, type = 'error') {
  }, 2800);
}

/* ─────────────────────────────────────────
   SHAKE
───────────────────────────────────────── */
function shake(id) {
  const el = byId(id);
  if (!el) return;
@@ -176,9 +163,6 @@ function shake(id) {
  step();
}

/* ─────────────────────────────────────────
   SERVICE SUBTYPE POPULATION
───────────────────────────────────────── */
function populateJobTypes(serviceValue) {
  const subField = byId('sub-field');
  const sel = byId('job-type');
@@ -197,16 +181,12 @@ function populateJobTypes(serviceValue) {
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
@@ -312,9 +292,6 @@ function goBack(step) {
  showStep(step - 1);
}

/* ─────────────────────────────────────────
   BUILD LEAD DATA
───────────────────────────────────────── */
function buildLeadData() {
  return {
    service: titleCaseService(selectedService()),
@@ -350,9 +327,6 @@ function buildWhatsAppMessage(data) {
  ].join('\n');
}

/* ─────────────────────────────────────────
   WEBHOOK SEND
───────────────────────────────────────── */
async function sendLeadToWebhook(data) {
  if (!looksLikeWebhookSet()) return false;

@@ -387,9 +361,6 @@ async function sendLeadToWebhook(data) {
  }
}

/* ─────────────────────────────────────────
   SUBMIT
───────────────────────────────────────── */
async function doSubmit() {
  if (!validateStep3()) return;

@@ -420,7 +391,7 @@ async function doSubmit() {
  if (webhookOk) {
    showToast('Request submitted. Opening WhatsApp now...', 'success');
  } else {
    showToast('Opening WhatsApp to finish your request...', 'success');
    showToast('Opening WhatsApp now. Your request will be sent there.', 'success');
  }

  window.open(url, '_blank', 'noopener,noreferrer');
@@ -432,9 +403,6 @@ async function doSubmit() {
  }
}

/* ─────────────────────────────────────────
   FAQ ACCORDION
───────────────────────────────────────── */
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains('open');
@@ -446,9 +414,6 @@ function toggleFaq(btn) {
  if (!isOpen) item.classList.add('open');
}

/* ─────────────────────────────────────────
   AREA CHIPS
───────────────────────────────────────── */
function bindAreaChips() {
  document.querySelectorAll('.achip').forEach(function (chip) {
    chip.addEventListener('click', function () {
@@ -460,17 +425,11 @@ function bindAreaChips() {
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

@@ -488,9 +447,6 @@ function initReveal() {
  });
}

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  showStep(1);
