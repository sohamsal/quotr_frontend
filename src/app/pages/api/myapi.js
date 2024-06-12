// pages/api/myapi.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { zipCode, query } = req.body;
      // Perform any necessary server-side logic, such as making a request to an external API
      // Example:
      const response = await fetch(`http://localhost:3001/`);
      const data = await response.json();
      res.status(200).json(data);
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
  