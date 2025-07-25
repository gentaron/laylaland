import { readFileSync } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Read knowledge base files
    const laylaContent = readFileSync(join(process.cwd(), 'layla.txt'), 'utf-8');
    const statsContent = readFileSync(join(process.cwd(), 'stats.csv'), 'utf-8');
    const rankContent = readFileSync(join(process.cwd(), 'rank.csv'), 'utf-8');

    // Create context from files
    const context = `
LAYLA VIREL NOVA KNOWLEDGE BASE:

=== CHARACTER INFORMATION ===
${laylaContent.substring(0, 2000)}

=== BATTLE STATISTICS ===
${statsContent}

=== RANKINGS DATA ===
${rankContent}

=== ADDITIONAL CONTEXT ===
Layla Virel Nova, also known as "Pink Voltage", is a cybernetically enhanced vigilante in the floating city of Gigapolis. She ranks #3 among all fighters with a 92% win rate and 312 victories out of 339 total battles. She is 29 years old with ESFP personality type. Her signature moves include Lightning Strike, Electrified Punch, and Nanofiber Kick.
`;

    // Call Groq API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant with expert knowledge about Layla Virel Nova (Pink Voltage), a cyberpunk vigilante. Use the provided knowledge base to answer questions accurately and enthusiastically. Always stay in character as someone who admires Layla's heroic work. Keep responses conversational and engaging.

${context}`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.statusText}`);
    }

    const groqData = await groqResponse.json();
    const aiResponse = groqData.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    res.status(200).json({ response: aiResponse });

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Failed to process your message',
      details: error.message 
    });
  }
}