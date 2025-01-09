import { GraphQLClient } from 'graphql-request';

export default async function handler(req, res) {
  const GITHUB_API = 'https://api.github.com/graphql';
  const GITHUB_TOKEN = process.env.GITHUB_API_TOKEN; // Ensure this is set in Vercel

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Handle preflight
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { query, variables } = req.body;

    // Debugging logs
    console.log('Query:', query);
    console.log('Variables:', variables);

    const client = new GraphQLClient(GITHUB_API, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    const data = await client.request(query, variables);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
}
