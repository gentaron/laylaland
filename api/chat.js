const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
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

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check API key
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('Missing GROQ_API_KEY');
      return res.status(200).json({ 
        response: "Hi! I'm having trouble connecting to my AI brain right now. Please make sure the GROQ_API_KEY is set in your Vercel environment variables!"
      });
    }

    console.log('API Key found, making Groq request...');
    console.log('User message:', message);

    // Simple Groq API call without complex context first
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant with expert knowledge about Layla Virel Nova (Pink Voltage), a cybernetically enhanced vigilante in the floating city of Gigapolis. She ranks #3 among all fighters with a 92% win rate and 312 victories out of 339 total battles. She is 29 years old with ESFP personality type. Her signature moves include Lightning Strike, Electrified Punch, and Nanofiber Kick. Always stay enthusiastic and helpful!'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    console.log('Groq response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      
      return res.status(200).json({ 
        response: `I'm Pink Voltage's AI assistant! There seems to be an issue with my connection (Error ${response.status}). But I can still tell you that Layla Virel Nova is an amazing cybernetically enhanced vigilante who ranks #3 among fighters! She's known for her Lightning Strike, Electrified Punch, and Nanofiber Kick. What would you like to know about her?`
      });
    }

    const data = await response.json();
    console.log('Groq response received successfully');
    
    const aiResponse = data.choices?.[0]?.message?.content;
    
    if (!aiResponse) {
      console.error('No response content from Groq');
      return res.status(200).json({ 
        response: "I'm Pink Voltage's AI assistant! I received your message but couldn't generate a proper response. Layla Virel Nova is an incredible fighter - what specific aspect of her adventures interests you?"
      });
    }

    return res.status(200).json({ response: aiResponse });

  } catch (error) {
    console.error('Detailed error:', error);
    
    return res.status(200).json({ 
      response: `Hi! I'm Pink Voltage's AI assistant. I'm experiencing technical difficulties (${error.message}), but I'm still here to help! Layla Virel Nova is a cybernetically enhanced vigilante who fights for justice in Gigapolis. What would you like to know about her incredible adventures?`
    });
  }
};