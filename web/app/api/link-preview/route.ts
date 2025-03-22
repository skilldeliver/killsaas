import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr('content') || 
                 $('title').text() || 
                 new URL(url).hostname;

    const description = $('meta[property="og:description"]').attr('content') || 
                       $('meta[name="description"]').attr('content') || 
                       '';

    const image = $('meta[property="og:image"]').attr('content') || 
                 $('meta[property="twitter:image"]').attr('content') || 
                 '';

    const siteName = $('meta[property="og:site_name"]').attr('content') || 
                    new URL(url).hostname.replace(/^www\./, '');

    return NextResponse.json({
      title,
      description,
      image,
      siteName,
    });
  } catch (error) {
    console.error('Error fetching preview:', error);
    return NextResponse.json({ error: 'Failed to fetch preview' }, { status: 500 });
  }
} 