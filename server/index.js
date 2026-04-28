import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
config();

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', model: process.env.OPENAI_API_KEY ? 'openai' : 'fallback' }));

// Chat endpoint — proxies to OpenAI if API key is set
app.post('/api/chat', async (req, res) => {
  const { message, stats } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'No API key configured — using client-side fallback' });
  }

  try {
    const systemPrompt = `You are EcoBot, a friendly and motivating AI environmental assistant. 
You help users track and reduce their carbon footprint, water usage, and energy consumption.
The user's current stats: Carbon ${stats?.carbonKg || 4.2} kg/day, Water ${stats?.waterLiters || 142} L/day, Energy ${stats?.energyKwh || 8.6} kWh/day, Eco Score ${stats?.ecoScore || 72}/100.
Always:
- Use eco-relevant emojis naturally
- Give specific, actionable advice with real numbers
- Be encouraging, never judgmental
- Keep responses concise but information-rich (max 200 words)
- Suggest tracking and gamification when relevant`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: message },
        ],
        max_tokens: 350,
        temperature: 0.75,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'OpenAI error');
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '';

    // Simple stat delta based on eco keywords
    const positiveWords = ['reduce','save','recycle','cycle','walk','solar','compost','reuse','plant'];
    const hasPositive   = positiveWords.some(w => message.toLowerCase().includes(w));
    const statsDelta    = hasPositive ? { ecoScore: 1, points: 15 } : { points: 5 };

    res.json({ reply, statsDelta });

  } catch (err) {
    console.error('OpenAI error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🌿 EcoBot API server running on http://localhost:${PORT}`);
  console.log(`   OpenAI key: ${process.env.OPENAI_API_KEY ? '✅ set' : '❌ not set (client fallback active)'}\n`);
});
