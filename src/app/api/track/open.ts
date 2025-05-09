// pages/api/track/open.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { emailId } = req.query;

  if (!emailId) {
    return res.status(400).json({ error: 'Missing emailId parameter' });
  }

  try {
    // TODO: Optional - Save open tracking data to your database
    console.log(`Email opened. Email ID: ${emailId}`);

    // Return a 1x1 transparent pixel
    const pixel = Buffer.from(
      'R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
      'base64'
    );

    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Content-Length', pixel.length.toString());
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.status(200).end(pixel);
  } catch (error) {
    console.error('Error in open tracking:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
