import { NextRequest, NextResponse } from 'next/server';
// import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
  try {
    const { html } = await req.json(); // Get HTML content from the request body

    // Launch Puppeteer to generate the PDF
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();

    // // Set content for Puppeteer to generate PDF
    // await page.setContent(html);

    // // Generate PDF (you can adjust the format and margins)
    // const pdfBuffer = await page.pdf({ format: 'A4' });

    // await browser.close();

    // // Return the PDF as a base64 string
    // const pdfBase64 = pdfBuffer.toString('base64');
    return NextResponse.json({ pdf: 'pdfBase64' });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Error generating PDF' }, { status: 500 });
  }
}