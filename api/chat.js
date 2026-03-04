module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      response: 'AI接続エラー: Vercel の環境変数に GEMINI_API_KEY を設定してください。'
    });
  }

  const systemPrompt = `You are an AI assistant with expert knowledge about Layla Virel Nova, also known as "Pink Voltage". She is a cybernetically enhanced vigilante living in the floating mega-city of Gigapolis (population 4 quadrillion). Key facts:
- Age: 29, Personality: ESFP
- Combat rank: #3 among all fighters, Win rate: 92%, Record: 312W / 27L (339 total)
- Signature moves: Lightning Strike, Electrified Punch, Nanofiber Kick
- Appearance: pink twin-tails, white leotard, red cape, blue gloves and boots
- Abilities: cybernetic enhancements, super strength, flight via nanofiber boots
- Character arc: from warrior to advocate for disabled communities
Respond concisely and enthusiastically. If asked in Japanese, reply in Japanese.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
      }),
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, err);
      return res.status(200).json({
        response: `AIへの接続中にエラーが発生しました (${geminiRes.status})。しばらくしてからもう一度お試しください。`
      });
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error('Empty Gemini response:', JSON.stringify(data));
      return res.status(200).json({ response: 'レスポンスを取得できませんでした。もう一度お試しください。' });
    }

    return res.status(200).json({ response: text });

  } catch (error) {
    console.error('chat.js error:', error);
    return res.status(200).json({
      response: `接続エラーが発生しました: ${error.message}`
    });
  }
};
