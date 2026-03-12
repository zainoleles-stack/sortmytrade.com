/* ─────────────────────────────────────────
   SORTMYTRADE — AI Job Description Assistant
   Calls Claude via Netlify AI Gateway.
   No API key needed — Netlify injects credentials automatically.
───────────────────────────────────────── */

function toggleAiPanel() {
  var panel = document.getElementById('ai-panel');
  panel.classList.toggle('visible');
}

function closeAiPanel() {
  document.getElementById('ai-panel').classList.remove('visible');
}

async function generateDescription() {
  var property = document.getElementById('ai-property').value;
  var bedrooms = document.getElementById('ai-bedrooms').value;
  var problem  = document.getElementById('ai-problem').value.trim();
  var extra    = document.getElementById('ai-extra').value.trim();
  var service  = document.querySelector('input[name="svc"]:checked');
  var jobType  = document.getElementById('job-type').value;

  if (!problem) {
    document.getElementById('ai-problem').focus();
    document.getElementById('ai-problem').style.borderColor = '#8b5cf6';
    return;
  }

  var btn = document.getElementById('ai-generate-btn');
  var resultBox  = document.getElementById('ai-result');
  var resultText = document.getElementById('ai-result-text');
  var errorBox   = document.getElementById('ai-error');

  // Loading state
  btn.disabled = true;
  btn.classList.add('loading');
  btn.querySelector('.gen-spinner').style.display = 'block';
  resultBox.classList.remove('visible');
  errorBox.classList.remove('visible');

  // Build context for Claude
  var serviceLabel = service ? service.value : 'trade service';
  var contextParts = [
    jobType    ? 'Job type: ' + jobType : 'Service: ' + serviceLabel,
    property   ? 'Property: ' + property : null,
    bedrooms && bedrooms !== 'Not applicable' ? bedrooms : null,
    'Problem / goal: ' + problem,
    extra      ? 'Additional info: ' + extra : null
  ].filter(Boolean).join('\n');

  var prompt = [
    'You are helping a UK homeowner write a clear job description for a trades quote request.',
    'Based on these details, write a concise, practical job description (3–5 sentences).',
    'Write in first person as the homeowner. Be specific and helpful to the tradesperson.',
    'Include relevant details like property type, scope of work, and any access notes.',
    'Do not include a greeting or sign-off — just the description itself.',
    '',
    'Details provided:',
    contextParts
  ].join('\n');

  try {
    var response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) throw new Error('API error ' + response.status);

    var data = await response.json();
    var text = data.content && data.content[0] && data.content[0].text
      ? data.content[0].text.trim()
      : null;

    if (!text) throw new Error('Empty response');

    // Show result with typewriter effect
    resultText.textContent = '';
    resultBox.classList.add('visible');
    typeText(resultText, text);

  } catch (err) {
    console.error('AI assistant error:', err);
    errorBox.classList.add('visible');
  } finally {
    btn.disabled = false;
    btn.classList.remove('loading');
    btn.querySelector('.gen-spinner').style.display = 'none';
  }
}

/* Typewriter effect */
function typeText(el, text) {
  var i = 0;
  el.textContent = '';
  var interval = setInterval(function() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(interval);
    }
  }, 14);
}

/* Copy AI description into the textarea and close the panel */
function useDescription() {
  var text = document.getElementById('ai-result-text').textContent;
  if (!text) return;
  var textarea = document.getElementById('job-desc');
  textarea.value = text;
  textarea.style.borderColor = 'var(--green)';
  textarea.style.boxShadow = '0 0 0 3px rgba(24,184,122,.12)';
  setTimeout(function() {
    textarea.style.borderColor = '';
    textarea.style.boxShadow = '';
  }, 2000);
  closeAiPanel();
  textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  const whatsappNumber = "447459819603"; // replace with your number
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;

  window.open(url, "_blank");
}
