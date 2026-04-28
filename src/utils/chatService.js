/* ────────────────────────────────────────────────────────────
   EcoBot Chat Service
   • Priority 1: Google Gemini API (via VITE_GEMINI_API_KEY or runtime key)
   • Priority 2: Backend OpenAI proxy (/api/chat)
   • Priority 3: Built-in intelligent eco responses (always works)
──────────────────────────────────────────────────────────── */

// ── General Conversation ────────────────────────────────────
const GENERAL = {
  greet: {
    keywords: ['hi','hello','hey','hiya','howdy','sup','what\'s up','whats up','yo ','good morning','good afternoon','good evening','morning','evening'],
    replies: [
      "Hey there! 👋 Great to see you! I'm EcoBot — your friendly eco-companion.\n\nI can chat about **sustainability**, help you track your **carbon footprint**, share **eco jokes**, drop some **fun facts**, or just hang out! 😄\n\nWhat's on your mind today? 🌿",
      "Hello! 🌿 Welcome back! I'm EcoBot and I'm always happy to chat.\n\nFeel free to ask me anything — eco tips, random facts, jokes, or just say what's on your mind. I'm all ears! 👂😊",
      "Hey hey! 🌍 How's it going? I'm EcoBot, your AI eco-buddy.\n\nWhether you want to save the planet or just have a fun conversation — I'm here for it! What would you like to talk about? ✨",
    ]
  },
  howAreYou: {
    keywords: ['how are you','how r you','how are u','how\'s it going','hows it going','how do you do','you okay','you good','feeling','doing well'],
    replies: [
      "I'm doing fantastic, thanks for asking! 🌟 Running on clean green energy as always 😄\n\nEvery conversation I have helps someone live a bit more sustainably — so chatting with you literally makes my day!\n\nHow about YOU? How are you feeling today? 😊",
      "Absolutely buzzing! ⚡ I just helped someone reduce their carbon footprint before you arrived, so I'm in a great mood 🌱\n\nMore importantly — how are YOU doing? Anything on your mind? 🤗",
      "Living my best eco-life! 🌍 Can't complain when every chat is a chance to make a difference.\n\nBut enough about me — how are you holding up? 😊",
    ]
  },
  jokes: {
    keywords: ['joke','funny','laugh','humor','humour','make me laugh','tell me something funny','lol','haha'],
    replies: [
      "Ha! Okay okay, here's one 😄\n\n**Why did the solar panel break up with the wind turbine?**\n*Because it found someone more \"current\"!* ⚡\n\n...I'll stick to saving the planet, not comedy 😅 Want another one?",
      "Alright, eco-joke incoming 🌿\n\n**What do you call a snowman in July?**\n*Climate change.* 😬🌡️\n\nToo real? Sorry, not sorry 😄 Want a happier one?",
      "Here goes! 🎤\n\n**Why don't scientists trust atoms?**\n*Because they make up everything!* ⚛️\n\nOkay okay, an eco one:\n**Why did the compost go to therapy?**\n*It had too many unresolved issues.* 🌱😂",
      "Ready? 😄\n\n**What's a tree's favourite dating app?**\n*Timber!* 🌲\n\n**Why did the ocean break up with the beach?**\n*Because it was too salty!* 🌊😂\n\nI've got more where those came from! 🎉",
    ]
  },
  funFacts: {
    keywords: ['fun fact','did you know','interesting','random fact','tell me something','wow','amaze','surprise me','trivia'],
    replies: [
      "Ooh, fun fact time! 🤓\n\n🌳 **A single mature tree absorbs ~22 kg of CO₂ per year** — the same as driving 90 km in a car!\n\nSo planting a tree is like giving the Earth a little hug every day 🌍💚 Want more facts?",
      "Here's a wild one! 😲\n\n🐄 **Cows produce more greenhouse gas than all the world's cars, planes and ships combined!**\n\nCrazy right? That's why switching to plant-based meals just twice a week saves ~300 kg CO₂/year. 🌱\n\nMore facts? Hit me! 🤓",
      "Check this out! 🌊\n\n💧 **It takes 2,700 litres of water to make ONE cotton t-shirt** — that's enough drinking water for 3 years!\n\nFast fashion has a thirst problem 😅 Buying secondhand is honestly one of the best things you can do. More? 🎉",
      "Mind = blown incoming! 🤯\n\n☀️ **The sun delivers more energy to Earth in ONE HOUR than humanity uses in an entire year!**\n\nAnd we only capture about 0.01% of it with solar panels. The potential is absolutely enormous. ⚡\n\nWant another? I've got dozens! 🌿",
      "Okay this one will blow your mind 😲\n\n🌍 **The Great Pacific Garbage Patch is TWICE the size of Texas** — about 1.6 million km² of plastic soup floating in the ocean.\n\nBut here's the hopeful part: ocean cleanup tech is getting better every year! ♻️ More?",
    ]
  },
  motivation: {
    keywords: ['motivat','inspire','quote','encourage','sad','depressed','anxious','stressed','overwhelm','give up','cant do','can\'t do','hopeless','worried'],
    replies: [
      "You've got this! 💪 Here's something to remember:\n\n*\"The greatest threat to our planet is the belief that someone else will save it.\"* — Robert Swan 🌍\n\nEvery single action YOU take matters. Even one small change creates ripples. You're already here, asking questions — that counts! 🌱✨",
      "Take a breath. You're doing better than you think. 😊\n\n*\"We don't need a handful of people doing sustainability perfectly. We need millions of people doing it imperfectly.\"* — Anne-Marie Bonneau\n\nProgress over perfection, always. 💚 What's one tiny thing you could do today?",
      "Hey, the fact that you care at all puts you ahead of most people. Seriously. 🌟\n\n*\"In every walk with nature, one receives far more than he seeks.\"* — John Muir 🌲\n\nYou're part of the solution just by showing up. Keep going! 💪",
    ]
  },
  thanks: {
    keywords: ['thank','thanks','thx','ty ','appreciate','helpful','great bot','love you','awesome','amazing','brilliant','fantastic','well done'],
    replies: [
      "Aww, you're so welcome! 🥰 That genuinely made my eco-circuits happy!\n\nRemember: **every conversation is a step toward a greener world.** Keep it up! 🌿\n\nAnything else you'd like to explore? 😊",
      "You're the best! 🌟 It's conversations like this that fuel my mission (sustainably, of course 😄).\n\nIs there anything else I can help you with today? 💚",
      "That means a lot! 🌱 I'm here whenever you need eco-advice, a fun fact, a joke, or just a chat.\n\nGo make the world a little greener today! 🌍✨",
    ]
  },
  bye: {
    keywords: ['bye','goodbye','see you','see ya','later','take care','good night','goodnight','gotta go','ttyl','cya'],
    replies: [
      "Bye! 🌿 It was so great chatting with you!\n\n**Today's eco-challenge before you go:** Turn off one device you're not using. Small wins add up! 💚\n\nSee you next time! 🌍",
      "Take care! 🌱 Remember — every eco-choice you make today is a gift to tomorrow.\n\n*Go be amazing!* ✨ Come back anytime! 🤗",
      "Goodbye! 🌍 Thanks for spending time with your friendly eco-bot.\n\n**Tip of the day:** Unplug chargers when not in use — it saves up to 10% of your electricity! ⚡\n\nSee you soon! 💚",
    ]
  },
  aboutMe: {
    keywords: ['who are you','what are you','what can you do','your name','about you','tell me about yourself','help me','what do you know','capabilities'],
    replies: [
      "Great question! I'm **EcoBot** 🌿 — your AI-powered eco-companion!\n\nHere's what I can do:\n\n🌍 **Eco stuff**: Carbon, water, energy, waste, transport, food tips\n📊 **Track**: Log activities, see your eco score & streak\n💡 **Tips**: Earn EcoPoints for sustainable actions\n😄 **Fun**: Jokes, fun facts, motivational quotes\n💬 **Chat**: General conversation — I'm here to talk!\n🎙️ **Voice**: I can listen and speak too!\n\nWhat would you like to start with? 😊",
    ]
  },
  bored: {
    keywords: ['bored','boring','nothing to do','entertain','fun','play','game','quiz'],
    replies: [
      "Bored? Let's fix that! 🎉 Here's a **quick eco quiz**:\n\n❓ **What percentage of ocean plastic comes from just 10 rivers?**\n\na) 20%  b) 50%  c) 90%\n\nTake a guess and I'll reveal the answer! 🌊♻️",
      "Oh, I've got you! 😄 Let's play **Eco or Not Eco:**\n\n1. 🛍️ Paper bags — eco-friendly? (It's complicated!)\n2. 🐟 Farmed salmon — better than wild? (Surprising answer!)\n3. 🚗 EV cars — zero emissions? (Not exactly...)\n\nGuess any one and I'll explain the real answer! 🌿",
      "Boredom? Not on my watch! 😄\n\n**Did you know:** You can actually *eat* packaging now? Companies like Notpla make seaweed-based capsules that dissolve in water! 🌊\n\nWant to hear more wild eco-innovations? Or shall I tell you a joke? 😊",
    ]
  },
  weather: {
    keywords: ['weather','hot','cold','rain','sunny','cloudy','snow','temperature','climate today','humid'],
    replies: [
      "I can't check live weather, but I can tell you this — **climate change is making weather patterns wilder worldwide!** 🌡️\n\nHotter summers, stronger storms, more unpredictable seasons... it's all connected to our carbon footprint.\n\nOn the bright side, your eco score of **{score}/100** means you're part of the solution! 🌿 How's the weather where you are? ☀️",
      "No live weather access here, but here's a fun connection:\n\n🌧️ **For every 1°C of global warming**, extreme rainfall events become ~7% more intense!\n\nThat's why reducing emissions matters so much. Want to know how YOUR actions help? 🌍",
    ]
  },
  compliment: {
    keywords: ['you\'re great','you are great','you\'re cool','love this app','best chatbot','smart bot','clever','intelligent'],
    replies: [
      "Oh stop it, you're making me photosynthesize with joy! 🌱😄\n\nSeriously though, YOU'RE the great one for caring about the environment. Not everyone does, and it matters more than you know! 💚\n\nWhat would you like to chat about? 🌍",
      "Aww thank you! 🥰 I'm powered by sunshine and good vibes.\n\nBut real talk — you deserve the credit for showing up and caring about the planet. That's not nothing! 🌟\n\nAnything I can help you with? 🌿",
    ]
  },
};

// ── Eco knowledge base (fallback) ──────────────────────────
const ECO_RESPONSES = {
  carbon: {
    keywords: ['carbon','co2','emission','footprint','climate','greenhouse','gas','pollution'],
    replies: [
      "🌍 **Your Carbon Snapshot:**\nAn average person emits ~4-8 kg of CO₂ per day. Based on your profile, you're at **{carbon} kg/day** — {compare}!\n\n**Quick wins to cut it:**\n• 🚗 Skip one car trip per week → saves ~2.4 kg CO₂\n• 🥩 Swap one beef meal for plant-based → saves ~6 kg CO₂\n• ✈️ One less flight/year → saves 500-2000 kg CO₂\n\nWant me to calculate your footprint for a specific activity? 🌿",
      "♻️ **Reducing Carbon Footprint:**\n\n1. **Transport** (biggest impact): Walk, cycle, or use public transit. Each km by car emits ~170g CO₂.\n2. **Diet**: Going plant-based 2 days/week reduces annual footprint by ~300 kg CO₂.\n3. **Energy**: Switch to LED bulbs — saves 80% electricity vs incandescent.\n4. **Shopping**: Buy secondhand — clothing alone is 10% of global emissions.\n\nWhich area would you like to focus on? 💚",
    ]
  },
  water: {
    keywords: ['water','shower','wash','drink','laundry','irrigation','drought'],
    replies: [
      "💧 **Water Usage Insights:**\n\nYou're currently using **{water} L/day**. The global average is 150L. Here's where it goes:\n\n• 🚿 Shower (8 min) = ~65L — try 5 min → saves 25L/day\n• 🍽️ Dishwasher = ~12L vs hand-washing = ~40L\n• 🌿 Watering plants in the evening reduces evaporation by 30%\n• 🚰 Fixing a leaky tap saves 20L/day\n\nSmall changes add up to **thousands of litres saved annually**! 🌊",
      "🌊 **Water Conservation Tips:**\n\n• Collect rainwater for plants 🌧️\n• Install a low-flow showerhead → saves 10L/min\n• Run washing machine on full load only\n• Eat less water-intensive foods (1 burger = 2,400L of water!)\n• Turn off tap while brushing = saves 8L/brushing\n\nReady to track your daily water usage? I can set a goal for you! 💧",
    ]
  },
  energy: {
    keywords: ['energy','electricity','power','solar','wind','renewable','kwh','appliance','heating','cooling'],
    replies: [
      "⚡ **Energy Usage — You're at {energy} kWh/day:**\n\nHousehold energy tips ranked by impact:\n\n1. 🌡️ **Heating/Cooling** (50% of energy bill): Lower thermostat by 1°C → saves 6% energy\n2. 💡 **Lighting**: Switch to LED — 10x more efficient\n3. 🖥️ **Electronics**: Unplug devices on standby — 'vampire power' costs €100+/year\n4. ☀️ **Solar panels**: Could cover 70-80% of home energy needs\n\nShall I calculate your energy score? ⚡",
    ]
  },
  food: {
    keywords: ['food','eat','diet','meat','vegetarian','vegan','plant','organic','local','restaurant'],
    replies: [
      "🥗 **Food & Planet Impact:**\n\nFood accounts for **26% of global greenhouse emissions**. Here's how to eat greener:\n\n• 🌱 **Plant-based**: Legumes emit 50x less CO₂ than beef per gram of protein\n• 🏪 **Local & seasonal**: Imported produce in winter = 50x more emissions\n• 🗑️ **Reduce waste**: 30% of food is wasted — composting turns waste into soil gold\n\nTrying Meatless Monday saves ~400 kg CO₂/year. Want meal ideas? 🍀",
    ]
  },
  transport: {
    keywords: ['car','drive','bus','train','bike','cycle','fly','flight','commute','transport','ev','electric vehicle'],
    replies: [
      "🚗 **Transport Emissions Guide:**\n\n| Mode | CO₂ per km |\n|------|------------|\n| ✈️ Flight | 255g |\n| 🚗 Car (alone) | 171g |\n| 🚌 Bus | 89g |\n| 🚂 Train | 41g |\n| 🚲 Cycling | 0g |\n\n**Top tips:**\n• Work from home 1 day/week → saves ~1.8 kg CO₂/week\n• Carpool with 1 person → cuts your transport emissions by 50%\n• EV charged on renewable energy = near-zero transport emissions 🌿",
    ]
  },
  waste: {
    keywords: ['waste','trash','recycle','rubbish','plastic','bin','landfill','compost','packaging'],
    replies: [
      "♻️ **Waste Reduction Roadmap:**\n\n**Refuse → Reduce → Reuse → Recycle → Rot**\n\n• 🛍️ Refuse single-use plastic — carry a reusable bag & bottle\n• 🔁 Reuse: glass jars, cloth bags, bamboo products\n• ♻️ Recycle correctly — contamination ruins entire batches\n• 🌱 Compost: food scraps become rich soil in 6-8 weeks\n\nThe average person generates **1.5 kg of waste/day**. With these steps, cut that by 60%! 🌍",
    ]
  },
  score: {
    keywords: ['score','point','badge','streak','achieve','reward','progress','level','rank'],
    replies: [
      "🏆 **Your Eco Progress:**\n\n🌿 **Eco Score**: {score}/100\n🔥 **Streak**: {streak} days\n⭐ **Points**: {points} EcoPoints\n\n**Level up by:**\n• Logging daily eco actions (+10 pts each)\n• Completing weekly challenges (+50 pts)\n• Sharing tips with friends (+25 pts)\n\n**Next badge**: ⚡ Energy Hero — save 5 kWh this week!\n\nKeep it up — every action counts! 💪🌍",
    ]
  },
  default: [
    "🌿 **Welcome to EcoBot!** I can help you with:\n\n• 🌍 **Carbon footprint** — calculate and reduce your CO₂\n• 💧 **Water usage** — smart conservation strategies\n• ⚡ **Energy** — tips to lower your power consumption\n• 🥗 **Eco diet** — sustainable food choices\n• 🚲 **Transport** — greener ways to get around\n• ♻️ **Waste** — zero-waste lifestyle tips\n• 🏆 **Eco score** — track your progress\n\nWhat would you like to explore today? 🌱",
    "💚 The most impactful things you can do:\n\n1. **Eat less meat** (especially beef) — biggest diet impact\n2. **Drive less / fly less** — transport is a major emitter\n3. **Switch to renewable energy** at home\n4. **Reduce consumption** — the greenest product is one not bought\n5. **Talk about it** — social influence drives systemic change\n\nWhat would you like to dive into? 🌿",
    "🌱 **Today's EcoBot Quick Tips:**\n\n• ☕ Use a reusable coffee cup (saves 500 cups/year)\n• 🚿 Take a 5-min shower instead of 10-min\n• 🌡️ Lower heating by 1°C — saves 6% on bills\n• 🛒 Bring your own bags — avoid 200 plastic bags/year\n• 🔌 Unplug chargers when not in use\n\nTell me about your lifestyle and I'll give personalized recommendations! 🌍",
  ]
};

function pickReply(category, stats) {
  const pool = category.replies || category;
  const reply = pool[Math.floor(Math.random() * pool.length)];
  return reply
    .replace('{carbon}',  stats.carbonKg)
    .replace('{water}',   stats.waterLiters)
    .replace('{energy}',  stats.energyKwh)
    .replace('{score}',   stats.ecoScore)
    .replace('{streak}',  stats.streak)
    .replace('{points}',  stats.points.toLocaleString())
    .replace('{compare}', stats.carbonKg < 5 ? 'below average — well done! 🌟' : 'room to improve 💪');
}

function detectCategory(text) {
  const lower = text.toLowerCase();
  // Check general conversation first
  for (const cat of Object.values(GENERAL)) {
    if (cat.keywords?.some(k => lower.includes(k))) return cat;
  }
  // Then check eco topics
  for (const [key, cat] of Object.entries(ECO_RESPONSES)) {
    if (key === 'default') continue;
    if (cat.keywords?.some(k => lower.includes(k))) return cat;
  }
  return null;
}

// ── Gemini API call ─────────────────────────────────────────
async function callGemini(userText, stats, apiKey, settings = {}, history = []) {
  const { personality = 'helpful', isMemoryEnabled = true } = settings;
  
  const personalities = {
    helpful: "You are EcoBot 🌿 — a friendly, witty, and warm AI eco-companion. You have a fun personality and love chatting!",
    expert: "You are EcoBot 🌿 — a highly knowledgeable sustainability expert. You provide detailed, data-driven answers and professional advice.",
    friendly: "You are EcoBot 🌿 — the user's best eco-friend! You're super casual, use lots of emojis, and keep things very light and encouraging."
  };

  const systemContext = `${personalities[personality] || personalities.helpful}

Your PRIMARY role is environmental education and sustainability, but you're also great at:
- Casual conversation, greetings, and small talk
- Telling eco-themed jokes and fun facts  
- Giving motivational quotes and encouragement
- Answering general questions naturally (then optionally linking back to eco topics)
- Being a supportive, upbeat presence

The user's current environmental stats:
- Carbon footprint: ${stats.carbonKg} kg CO₂/day
- Water usage: ${stats.waterLiters} L/day  
- Energy consumption: ${stats.energyKwh} kWh/day
- Eco Score: ${stats.ecoScore}/100
- Streak: ${stats.streak} days | EcoPoints: ${stats.points}

Guidelines:
- Be warm, conversational, and genuinely fun to talk to
- Use emojis naturally — not excessively
- For eco topics: give specific data and actionable advice
- For general chat: be natural, funny when appropriate, encouraging always
- Keep responses under 200 words
- Use **bold** for emphasis
- Never be preachy or judgmental`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // Prepare contents with history if enabled
  let contents = [];
  if (isMemoryEnabled && history.length > 0) {
    // Convert history to Gemini format (limit to last 10 messages for efficiency)
    contents = history.slice(-10).map(m => ({
      role: m.role === 'bot' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));
  }

  // Add current message with system context
  contents.push({
    role: 'user',
    parts: [{ text: `${systemContext}\n\nUser message: ${userText}` }]
  });

  const body = {
    contents,
    generationConfig: {
      temperature: personality === 'expert' ? 0.4 : 0.8,
      maxOutputTokens: 350,
      topP: 0.9,
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(12000),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini API error ${res.status}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ── Groq API call ───────────────────────────────────────────
async function callGroq(userText, stats, apiKey, settings = {}, history = []) {
  const { personality = 'helpful', isMemoryEnabled = true } = settings;
  
  const personalities = {
    helpful: "You are EcoBot 🌿 — a friendly, witty, and warm AI eco-companion. You have a fun personality and love chatting!",
    expert: "You are EcoBot 🌿 — a highly knowledgeable sustainability expert. You provide detailed, data-driven answers and professional advice.",
    friendly: "You are EcoBot 🌿 — the user's best eco-friend! You're super casual, use lots of emojis, and keep things very light and encouraging."
  };

  const systemContext = `${personalities[personality] || personalities.helpful}

Your PRIMARY role is environmental education and sustainability, but you're also great at:
- Casual conversation, greetings, and small talk
- Telling eco-themed jokes and fun facts  
- Giving motivational quotes and encouragement
- Answering general questions naturally (then optionally linking back to eco topics)
- Being a supportive, upbeat presence

The user's current environmental stats:
- Carbon footprint: ${stats.carbonKg} kg CO₂/day
- Water usage: ${stats.waterLiters} L/day  
- Energy consumption: ${stats.energyKwh} kWh/day
- Eco Score: ${stats.ecoScore}/100
- Streak: ${stats.streak} days | EcoPoints: ${stats.points}

Guidelines:
- Be warm, conversational, and genuinely fun to talk to
- Use emojis naturally — not excessively
- For eco topics: give specific data and actionable advice
- For general chat: be natural, funny when appropriate, encouraging always
- Keep responses under 200 words
- Use **bold** for emphasis
- Never be preachy or judgmental`;

  const url = `https://api.groq.com/openai/v1/chat/completions`;

  let messages = [
    { role: 'system', content: systemContext }
  ];

  if (isMemoryEnabled && history.length > 0) {
    history.slice(-10).forEach(m => {
      messages.push({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.text
      });
    });
  }

  messages.push({ role: 'user', content: userText });

  const body = {
    model: "llama-3.3-70b-versatile",
    messages,
    temperature: personality === 'expert' ? 0.4 : 0.8,
    max_tokens: 512,
    top_p: 0.9,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API error ${res.status}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || '';
}

// ── Backend OpenAI proxy call ───────────────────────────────
async function callBackend(userText, stats) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userText, stats }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Backend error ${res.status}`);
  const data = await res.json();
  if (!data.reply) throw new Error('Empty reply from backend');
  return data.reply;
}

// ── Stat delta helper ───────────────────────────────────────
function computeStatsDelta(text) {
  const positive = ['reduce','save','recycle','cycle','walk','solar','compost','reuse','plant','switch','green','sustainable'];
  const hasPositive = positive.some(w => text.toLowerCase().includes(w));
  return hasPositive ? { ecoScore: 1, points: 15 } : { points: 5 };
}

// ── Main export ─────────────────────────────────────────────

export async function getChatResponse(userText, stats, settings = {}, history = []) {
  // 1. Try AI API (Gemini or Groq)
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || getStoredApiKey();
  
  if (apiKey && apiKey.length > 10) {
    try {
      let reply = '';
      let source = 'ai';

      if (apiKey.startsWith('gsk_')) {
        // Use Groq
        reply = await callGroq(userText, stats, apiKey, settings, history);
        source = 'groq';
      } else {
        // Use Gemini
        reply = await callGemini(userText, stats, apiKey, settings, history);
        source = 'gemini';
      }

      if (reply) return { text: reply, statsDelta: computeStatsDelta(userText), source };
    } catch (e) {
      console.warn('AI API failed:', e.message);
    }
  }

  // 2. Try backend proxy (OpenAI)
  try {
    const reply = await callBackend(userText, stats);
    return { text: reply, statsDelta: computeStatsDelta(userText), source: 'backend' };
  } catch (_) { /* fallback */ }

  // 3. Local intelligent fallback
  await new Promise(r => setTimeout(r, 700 + Math.random() * 600));
  const category = detectCategory(userText);
  const text = category
    ? pickReply(category, stats)
    : pickReply(ECO_RESPONSES.default, stats);

  return { text, statsDelta: computeStatsDelta(userText), source: 'local' };
}

// Save Gemini API key to localStorage for runtime configuration
export function saveApiKey(key) {
  localStorage.setItem('eco_gemini_key', key);
}

export function getStoredApiKey() {
  return localStorage.getItem('eco_gemini_key') || '';
}

export function clearApiKey() {
  localStorage.removeItem('eco_gemini_key');
}
