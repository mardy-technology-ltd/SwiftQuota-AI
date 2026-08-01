import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ success: false, error: 'Text input is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      console.log('Gemini API key found, calling Gemini...');
      try {
        const prompt = `You are an expert AI Invoice & Estimate Parser. Parse the following description into a structured JSON object representing the document data.
Strictly output JSON in the following format, with no markdown code blocks or wrapper text:
{
  "clientName": "Name of the client if specified, e.g. Liton",
  "documentType": "ESTIMATE" or "INVOICE",
  "items": [
    { "description": "Short description of the service/item", "quantity": number, "rate": number }
  ],
  "discount": percentage_discount_as_number_e_g_10,
  "tax": percentage_tax_as_number_e_g_10
}

Input Text: "${text.replace(/"/g, '\\"')}"`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: 'application/json'
              }
            })
          }
        );

        if (res.ok) {
          const json = await res.json();
          const responseText = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText) {
            const parsedData = JSON.parse(responseText.trim());
            return NextResponse.json({ success: true, data: parsedData });
          }
        } else {
          console.warn('Gemini API call failed with status', res.status);
        }
      } catch (geminiError) {
        console.error('Error during Gemini API parsing:', geminiError);
      }
    }

    // Offline / Fallback Parser
    console.log('Running offline regex parser fallback...');
    const parsedData = parseOffline(text);
    return NextResponse.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('AI Parser route error:', error);
    return NextResponse.json({ success: false, error: 'Failed to parse text' }, { status: 500 });
  }
}

function parseOffline(text) {
  const result = {
    clientName: '',
    documentType: 'ESTIMATE',
    items: [],
    discount: 0,
    tax: 10
  };

  // 1. Document Type
  if (/invoice/i.test(text)) {
    result.documentType = 'INVOICE';
  }

  // 2. Client Name
  const clientMatch = text.match(/(?:for|to|client)\s+([A-Z][a-zA-Z0-9]*)/);
  if (clientMatch) {
    result.clientName = clientMatch[1];
  }

  // 3. Discount
  const discountMatch =
    text.match(/(\d+(?:\.\d+)?)\s*%\s*discount/i) || text.match(/discount\s*(?:of\s*)?(\d+(?:\.\d+)?)\s*%/i);
  if (discountMatch) {
    result.discount = parseFloat(discountMatch[1]);
  }

  // 4. Tax
  const taxMatch = text.match(/(\d+(?:\.\d+)?)\s*%\s*tax/i) || text.match(/tax\s*(?:of\s*)?(\d+(?:\.\d+)?)\s*%/i);
  if (taxMatch) {
    result.tax = parseFloat(taxMatch[1]);
  }

  // 5. Line Items
  const segments = text.split(/(?:and|,|\.)/gi);
  for (const segment of segments) {
    const trimmed = segment.trim();
    if (!trimmed) continue;

    // Pattern: [description] for [quantity] [units] at [rate]
    let match = trimmed.match(/(.+?)\s+for\s+(\d+(?:\.\d+)?)\s*(?:hours|hrs|days|qty|units)?\s*(?:at\s*|\@\s*)\$?(\d+(?:\.\d+)?)/i);
    if (match) {
      result.items.push({
        description: match[1].trim(),
        quantity: parseFloat(match[2]),
        rate: parseFloat(match[3])
      });
      continue;
    }

    // Pattern: [description] [quantity] [units] at [rate]
    match = trimmed.match(/(.+?)\s+(\d+(?:\.\d+)?)\s*(?:hours|hrs|days|qty|units)?\s*(?:at\s*|\@\s*)\$?(\d+(?:\.\d+)?)/i);
    if (match) {
      const desc = match[1].trim();
      if (!/^(?:create|apply|discount|tax|invoice|estimate|quote)/i.test(desc)) {
        result.items.push({
          description: desc,
          quantity: parseFloat(match[2]),
          rate: parseFloat(match[3])
        });
      }
      continue;
    }
  }

  return result;
}
