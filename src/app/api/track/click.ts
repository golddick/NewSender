// pages/api/track/click.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { emailId, url } = req.query;

  if (!emailId || !url) {
    return res.status(400).json({ error: 'Missing emailId or url parameter' });
  }

  try {
    // Decode the URL parameter
    const decodedUrl = decodeURIComponent(url as string);

    // Optional: Log the click event (e.g., to a database or analytics service)
    console.log(`Email ID: ${emailId}, Clicked URL: ${decodedUrl}`);

    // Redirect the user to the original URL
    res.redirect(decodedUrl);
  } catch (error) {
    console.error('Error processing click:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
