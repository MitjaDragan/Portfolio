export default async function handler(req, res) {
    const { HANGMAN_API_KEY } = process.env;
  
    try {
      const response = await fetch('https://api.api-ninjas.com/v1/randomword', {
        headers: { 'X-Api-Key': HANGMAN_API_KEY },
      });
  
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching word:', error);
      res.status(500).json({ error: 'Failed to fetch word' });
    }
  }
  