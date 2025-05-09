// app/api/track/open/route.ts
import { NextResponse } from 'next/server';
import { recordOpen } from '@/lib/trackingService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const emailId = searchParams.get('emailId');

  if (!emailId) {
    return new NextResponse('Missing emailId parameter', { status: 400 });
  }

  try {
    await recordOpen(emailId);
    
    // Return a transparent 1x1 pixel
    return new NextResponse(
      Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64'),
      {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    );
  } catch (error) {
    console.error('Error processing open:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}