const { GraphQLClient } = require('graphql-request');

export default async function handler(req, res) {
  const GITHUB_API = 'https://api.github.com/graphql';
  const GITHUB_TOKEN = process.env.GITHUB_API_TOKEN; // Store this securely in Vercel's environment variables

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin (replace '*' with your frontend domain for stricter control)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); // Allow POST and OPTIONS methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Handle CORS preflight
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, variables } = req.body;

    const client = new GraphQLClient(GITHUB_API, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`, // Add the GitHub token securely
      },
    });

    const data = await client.request(query, variables);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from GitHub:', error);
    res.status(500).json({ error: error.message });
  }
}
