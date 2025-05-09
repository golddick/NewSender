


// app/api/track/click/route.ts
import { NextResponse } from 'next/server';
import { recordClick } from '@/lib/trackingService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const emailId = searchParams.get('emailId');
  const url = searchParams.get('url');

  if (!emailId || !url) {
    return new NextResponse('Missing parameters', { status: 400 });
  }

  try {
    const decodedUrl = decodeURIComponent(url);
    await recordClick(emailId, decodedUrl);
    return NextResponse.redirect(decodedUrl, 302);
  } catch (error) {
    console.error('Error processing click:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}