export default async function handler(req, res) {
    // Allow requests from all origins (adjust as needed for production)
    res.setHeader('Access-Control-Allow-Origin', '*'); // Replace '*' with your domain for better security
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
  
    const { HANGMAN_API_KEY } = process.env;
    if (!HANGMAN_API_KEY) {
      console.error('API key is missing');
      return res.status(500).json({ error: 'Server configuration error: API key missing' });
    }
  
    try {
      const response = await fetch('https://api.api-ninjas.com/v1/randomword', {
        headers: { 'X-Api-Key': HANGMAN_API_KEY },
      });
  
      if (!response.ok) {
        console.error(`API responded with status: ${response.status}`);
        return res.status(response.status).json({ error: 'Failed to fetch word' });
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching word:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  