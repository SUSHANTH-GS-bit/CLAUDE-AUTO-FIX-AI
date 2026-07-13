// ── Car models per brand ──────────────────────────────────────────
const MODELS = {
  "Maruti Suzuki": ["Swift", "Baleno", "WagonR", "Dzire", "Ertiga", "Brezza"],
  "Hyundai": ["i20", "Creta", "Venue", "Verna", "Grand i10"],
  "Tata Motors": ["Nexon", "Punch", "Altroz", "Tiago", "Harrier"],
  "Mahindra": ["Scorpio", "XUV700", "Thar", "Bolero"],
  "Toyota": ["Innova", "Fortuner", "Glanza", "Urban Cruiser"],
  "Honda": ["City", "Amaze", "Elevate"],
  "Kia": ["Seltos", "Sonet", "Carens"],
  "Renault": ["Kwid", "Triber", "Kiger"]
};

function updateModels(){
  const brand = document.getElementById('carBrand').value;
  const modelSel = document.getElementById('carModel');
  modelSel.innerHTML = '<option value="">Select model</option>';
  (MODELS[brand] || []).forEach(m => {
    const opt = document.createElement('option');
    opt.textContent = m;
    modelSel.appendChild(opt);
  });
}

function getCarContext(){
  const brand = document.getElementById('carBrand').value;
  const model = document.getElementById('carModel').value;
  const year = document.getElementById('carYear').value;
  const fuel = document.getElementById('fuelType').value;
  if (!brand) return null;
  return { brand, model, year, fuel,
    label: [brand, model, year, fuel].filter(Boolean).join(' ') };
}

// ── Offline knowledge base ────────────────────────────────────────
// Each entry: keywords to match, and a response builder (can use car context)
const KNOWLEDGE_BASE = [
  {
    keywords: ["engine light", "check engine", "warning light", "engine warning"],
    respond: (car) => `⚠️ <b>Engine warning light</b> usually points to a sensor or emissions issue${car ? ` on your ${car.label}` : ''}.<br><br>
      <b>Common causes:</b> loose fuel cap (free fix), oxygen sensor fault (₹1,500–3,000), or catalytic converter issue (₹5,000+).<br><br>
      <b>Try this first:</b> tighten your fuel cap and restart the car. If the light stays on after 2 more trips, get it scanned at a garage.`
  },
  {
    keywords: ["ac", "air conditioning", "cooling", "not cold", "cool"],
    respond: (car) => `❄️ <b>AC not cooling</b> is most often low refrigerant gas${car ? ` in your ${car.label}` : ''}.<br><br>
      <b>Estimated cost:</b> AC gas refill ₹800–1,500. Cabin air filter replacement ₹200–400 if it's clogged instead.<br><br>
      <b>Check first:</b> does the AC compressor clutch engage (a click sound) when you turn AC on? If not, it's likely the compressor, not just gas.`
  },
  {
    keywords: ["knock", "knocking", "engine sound", "engine noise", "tapping"],
    respond: (car) => `🔊 <b>Knocking sound from the engine</b> can mean several things${car ? ` on your ${car.label}` : ''}, from minor to serious.<br><br>
      <b>Likely causes:</b> low-quality fuel causing pre-ignition (try higher octane fuel), worn engine bearings (₹8,000–20,000), or low oil level.<br><br>
      <b>Do this now:</b> check your engine oil level with the dipstick. If it's low, top it up and get it checked immediately — this is not a "wait and see" issue.`
  },
  {
    keywords: ["battery", "won't start", "wont start", "not starting", "dead battery"],
    respond: (car) => `🔋 <b>Battery warning or car not starting</b>${car ? ` on your ${car.label}` : ''} usually means:<br><br>
      <b>Battery replacement:</b> ₹3,000–5,500 (batteries typically last 3–4 years).<br>
      <b>Alternator fault:</b> ₹4,000–8,000 if the battery isn't charging while driving.<br><br>
      <b>Check first:</b> look at the battery terminals for white/greenish corrosion — clean it off with a dry cloth and try starting again.`
  },
  {
    keywords: ["brake", "squeak", "squeaking", "grinding brake"],
    respond: (car) => `🛑 <b>Brake squeaking</b> almost always means worn brake pads${car ? ` on your ${car.label}` : ''}.<br><br>
      <b>Estimated cost:</b> front brake pads ₹1,200–2,500, rear ₹900–1,800.<br><br>
      <b>Important:</b> this is a safety issue. If you hear grinding (metal-on-metal) rather than squeaking, stop driving and get it checked today — the pads may be fully worn.`
  },
  {
    keywords: ["overheat", "overheating", "temperature high", "steam", "smoke from bonnet"],
    respond: (car) => `🌡️ <b>Overheating</b>${car ? ` on your ${car.label}` : ''} is serious — here's what to do right now:<br><br>
      <b>Immediately:</b> pull over safely, turn off the engine, and do NOT open the radiator cap while hot.<br><br>
      <b>Likely causes:</b> low coolant (₹300–500 top-up), radiator leak (₹2,000–6,000), or a faulty water pump (₹4,000–9,000). Get it towed if the temperature gauge is in the red.`
  },
  {
    keywords: ["vibrat", "shake", "shaking", "steering wheel"],
    respond: (car) => `🎯 <b>Steering wheel vibration</b>${car ? ` on your ${car.label}` : ''} is most often:<br><br>
      <b>Wheel balancing needed:</b> ₹150–300 per wheel (very common, especially after hitting a pothole).<br>
      <b>Uneven tyre wear or alignment:</b> ₹500–800 for a full alignment.<br><br>
      <b>Notice:</b> if vibration gets worse at higher speed, it's almost certainly wheel balancing — an easy, cheap fix.`
  },
  {
    keywords: ["mileage", "fuel efficiency", "fuel consumption", "petrol consumption"],
    respond: (car) => `⛽ <b>Sudden drop in mileage</b>${car ? ` on your ${car.label}` : ''} usually comes from:<br><br>
      <b>Clogged air filter:</b> ₹300–600 to replace — check/replace every 10,000 km.<br>
      <b>Low tyre pressure:</b> free to fix, check monthly — under-inflated tyres can cost you 3–5% mileage.<br>
      <b>Spark plug wear (petrol cars):</b> ₹150–400 per plug, replace every 20,000–30,000 km.`
  },
  {
    keywords: ["oil change", "engine oil", "oil light"],
    respond: (car) => `🛢️ <b>Engine oil</b>${car ? ` for your ${car.label}` : ''} — general guidance:<br><br>
      <b>Change interval:</b> every 10,000 km or 12 months, whichever comes first (check your manual for exact spec).<br>
      <b>Cost:</b> ₹1,500–3,500 depending on oil grade (mineral vs synthetic) and filter.<br><br>
      If the oil warning light is currently on, stop driving and check the oil level immediately — running low on oil can seriously damage the engine.`
  },
  {
    keywords: ["tyre", "tire", "puncture", "flat"],
    respond: (car) => `🛞 <b>Tyre issues</b>${car ? ` on your ${car.label}` : ''}:<br><br>
      <b>Puncture repair:</b> ₹50–150 at any roadside shop for tubeless tyres.<br>
      <b>New tyre:</b> ₹3,500–8,000 depending on your car's tyre size.<br><br>
      Rotate tyres every 8,000–10,000 km for even wear, and check pressure monthly — it's printed on a sticker inside the driver's door.`
  }
];

function findOfflineAnswer(message, car){
  const msg = message.toLowerCase();
  for (const entry of KNOWLEDGE_BASE){
    if (entry.keywords.some(k => msg.includes(k))){
      return entry.respond(car);
    }
  }
  return `🔧 I don't have that specific issue in my offline database yet (this build ships with ${KNOWLEDGE_BASE.length} common problems).<br><br>
    Try describing it differently, use one of the quick-question buttons on the left, or — if you've added a Claude API key — I'll attempt a live AI lookup instead.<br><br>
    For anything urgent or safety-related, please contact a mechanic directly.`;
}

// ── Attempt live API call if a key is provided (falls back to offline) ──
async function tryLiveAPI(message, car, apiKey){
  const systemPrompt = `You are Auto Fix AI mechanic for Indian cars. ${car ? `Car: ${car.label}.` : 'No car selected yet.'} Answer in simple language under 4 sentences. Give cost estimate in Indian Rupees. If serious, say "Visit a mechanic immediately."`;
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }]
    })
  });
  if (!resp.ok) throw new Error('API request failed: ' + resp.status);
  const data = await resp.json();
  return data.content[0].text;
}

function appendMessage(role, html){
  const box = document.getElementById('chatMessages');
  const msg = document.createElement('div');
  msg.className = 'msg ' + (role === 'ai' ? 'ai-msg' : 'user-msg');
  msg.innerHTML = `<div class="msg-bubble">${html}</div>`;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
  return msg;
}

function showTyping(){
  const box = document.getElementById('chatMessages');
  const msg = document.createElement('div');
  msg.className = 'msg ai-msg';
  msg.id = 'typingIndicator';
  msg.innerHTML = `<div class="msg-bubble"><span class="typing-dots"><span></span><span></span><span></span></span></div>`;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}
function hideTyping(){
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

async function processMessage(text){
  const car = getCarContext();
  appendMessage('user', escapeHtml(text));
  showTyping();

  const apiKey = document.getElementById('apiKey').value.trim();
  let answer;
  if (apiKey){
    try {
      answer = await tryLiveAPI(text, car, apiKey);
    } catch (e){
      answer = `⚠️ Live API call failed (${e.message}). This is expected in a browser-only static site — Anthropic's API typically blocks direct browser calls via CORS unless proxied through a backend. Falling back to the offline answer:<br><br>` + findOfflineAnswer(text, car);
    }
  } else {
    // slight delay so the typing indicator feels real
    await new Promise(r => setTimeout(r, 500));
    answer = findOfflineAnswer(text, car);
  }
  hideTyping();
  appendMessage('ai', answer);
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function sendMessage(){
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  processMessage(text);
}

function quickAsk(text){
  processMessage(text);
}

function handleKey(e){
  if (e.key === 'Enter') sendMessage();
}
