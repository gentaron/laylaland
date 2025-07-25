const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check if API key exists
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY not found in environment');
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'API key not configured'
      });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Received message:', message);

    // Read knowledge base files with error handling
    let laylaContent = '';
    let statsContent = '';
    let rankContent = '';

    try {
      laylaContent = fs.readFileSync(path.join(process.cwd(), 'layla.txt'), 'utf-8');
      console.log('Successfully read layla.txt');
    } catch (err) {
      console.error('Error reading layla.txt:', err.message);
      laylaContent = 'Layla Virel Nova information not available.';
    }

    try {
      statsContent = fs.readFileSync(path.join(process.cwd(), 'stats.csv'), 'utf-8');
      console.log('Successfully read stats.csv');
    } catch (err) {
      console.error('Error reading stats.csv:', err.message);
      statsContent = 'Battle statistics not available.';
    }

    try {
      rankContent = fs.readFileSync(path.join(process.cwd(), 'rank.csv'), 'utf-8');
      console.log('Successfully read rank.csv');
    } catch (err) {
      console.error('Error reading rank.csv:', err.message);
      rankContent = 'Ranking data not available.';
    }

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

    console.log('Making request to Groq API...');

    // Call Groq API with better error handling
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

    console.log('Groq API response status:', groqResponse.status);

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', groqResponse.status, errorText);
      
      // Return a fallback response instead of failing
      return res.status(200).json({ 
        response: `I'm Pink Voltage's AI assistant! I'd love to help you learn about Layla Virel Nova. Unfortunately, I'm having some technical difficulties right now, but I can tell you that Layla is an amazing cybernetically enhanced vigilante who ranks #3 among fighters with a 92% win rate! What would you like to know about her adventures?`
      });
    }

    const groqData = await groqResponse.json();
    const aiResponse = groqData.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    console.log('Successfully generated AI response');
    res.status(200).json({ response: aiResponse });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Return a user-friendly fallback response
    res.status(200).json({ 
      response: `Hi! I'm Pink Voltage's AI assistant! I'm experiencing some technical issues right now, but I'd still love to help you learn about Layla Virel Nova. She's an incredible cybernetically enhanced vigilante known as "Pink Voltage" who fights for justice in Gigapolis! What would you like to know about her?`
    });
  }
};