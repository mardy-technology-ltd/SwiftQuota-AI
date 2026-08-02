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
        const prompt = `You are an expert AI Invoice & Estimate Parser. Parse the following user request into a structured JSON object.
Strictly output JSON in the following format with no markdown formatting:
{
  "clientName": "Client or company name if mentioned e.g. BBC company",
  "documentType": "INVOICE" or "ESTIMATE",
  "items": [
    { "description": "Description of work or service", "quantity": number, "rate": number }
  ],
  "discount": number,
  "tax": number
}

Input Text: "${text.replace(/"/g, '\\"')}"`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
        }
      } catch (geminiError) {
        console.error('Error during Gemini API parsing:', geminiError);
      }
    }

    // Smart Offline Natural Language Parser Fallback
    console.log('Running smart offline natural language parser fallback...');
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

  // 1. Document Type Detection
  if (/invoice/i.test(text)) {
    result.documentType = 'INVOICE';
  } else if (/estimate|quote/i.test(text)) {
    result.documentType = 'ESTIMATE';
  }

  // 2. Client / Company Name Extraction
  const clientMatch =
    text.match(/(?:for|to|client)\s+([A-Za-z0-9\s]+?)(?:\s+(?:service|project|invoice|estimate|quote|items|with)|$)/i) ||
    text.match(/client\s*:?\s*([A-Za-z0-9\s]+)/i);
  if (clientMatch) {
    let rawName = clientMatch[1].trim();
    if (rawName) {
      result.clientName = rawName;
    }
  }

  // 3. Discount & Tax Extraction
  const discountMatch = text.match(/(\d+(?:\.\d+)?)\s*%\s*discount/i) || text.match(/discount\s*(?:of\s*)?(\d+(?:\.\d+)?)\s*%/i);
  if (discountMatch) {
    result.discount = parseFloat(discountMatch[1]);
  }

  const taxMatch = text.match(/(\d+(?:\.\d+)?)\s*%\s*tax/i) || text.match(/tax\s*(?:of\s*)?(\d+(?:\.\d+)?)\s*%/i);
  if (taxMatch) {
    result.tax = parseFloat(taxMatch[1]);
  }

  // 4. Line Items Extraction with Rates & Quantities
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
        continue;
      }
    }
  }

  // If no specific rate/qty item was parsed, extract the main service description
  if (result.items.length === 0) {
    let serviceDesc = "Professional Service";

    // Clean out command keywords
    let cleanText = text
      .replace(/^create\s+(?:a|an)?\s*(?:invoice|estimate|quote)?\s*(?:for)?/gi, "")
      .replace(/for\s+[A-Za-z0-9\s]+(?:company|ltd|inc|corp)/gi, "")
      .trim();

    if (cleanText) {
      serviceDesc = cleanText.charAt(0).toUpperCase() + cleanText.slice(1);
    } else {
      serviceDesc = "Roller Shutter Service";
    }

    result.items.push({
      description: serviceDesc,
      quantity: 1,
      rate: 150
    });
  }

  return result;
}
