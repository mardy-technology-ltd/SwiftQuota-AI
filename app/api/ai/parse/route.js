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
        const prompt = `You are a world-class AI Invoice & Estimate Parser that understands English, Banglish (Bengali written in Roman script e.g. "Sojib amar kache akta web development... 5 doller per hour. ami 120 hour kaj korechi. akhon tumi akta invoice banao"), and natural conversational text.
Your job is to parse the user's request into a clean, structured JSON object.

RULES:
1. "clientName": Extract client/person/company name. Look for patterns like "Sojib amar kache...", "for Sojib", "Sojib-er jonno", "Client: Sojib" -> "Sojib".
2. "documentType": "INVOICE" if words like "invoice", "banao", "bill", "invois" appear. "ESTIMATE" if "estimate", "istimate", "quote", "quotation" appear. Default "INVOICE".
3. "items": Extract line items.
   - "description": Summarize the work into a clean, professional English service title (e.g. "Web Development Service") instead of pasting raw chat sentences.
   - "quantity": Extract total hours/days/qty (e.g. "120 hour kaj korechi" -> 120, "10 hrs" -> 10).
   - "rate": Extract rate per hour/unit (e.g. "5 doller per hour", "$5/hr", "50$") -> 5.
4. "discount": Discount percentage if mentioned, else 0.
5. "tax": Tax percentage if mentioned, else 10.

Strictly output valid JSON with no markdown syntax:
{
  "clientName": "Sojib",
  "documentType": "INVOICE",
  "items": [
    { "description": "Web Development Service", "quantity": 120, "rate": 5 }
  ],
  "discount": 0,
  "tax": 10
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
    documentType: 'INVOICE',
    items: [],
    discount: 0,
    tax: 10
  };

  // 1. Document Type Detection (Fuzzy typo & Banglish matching: invoice, banao, istimate, bill, etc.)
  if (/invoice|invois|invice|bill|banao/i.test(text)) {
    result.documentType = 'INVOICE';
  } else if (/estimate|istimate|estimat|estmate|quote|quotation/i.test(text)) {
    result.documentType = 'ESTIMATE';
  }

  // 2. Client Name Extraction (English & Banglish: "Sojib amar kache...", "for Sojib", "Sojib-er jonno")
  const banglishClientMatch = text.match(/^([A-Z][a-z0-9]+)\s+(?:amar|kache|er|jonno|for|to)/i);
  const englishClientMatch = text.match(/(?:for|to|client)\s+([A-Za-z0-9\s]+?)(?:\s+(?:service|project|invoice|estimate|quote|items|with|amar)|$)/i);

  if (banglishClientMatch) {
    result.clientName = banglishClientMatch[1].trim();
  } else if (englishClientMatch) {
    let rawName = englishClientMatch[1].trim();
    if (rawName && !/^(?:a|an|the|web|landing|development|service)$/i.test(rawName)) {
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

  // 4. Rate & Quantity Parsing (English & Banglish e.g. "5 doller per hour. ami 120 hour kaj korechi")
  let rate = 50;
  let quantity = 1;

  const rateMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:doller|dollar|\$|usd|taka|tk)?\s*(?:per|\/)\s*(?:hour|hr|ghanta)/i) ||
                    text.match(/(\d+(?:\.\d+)?)\s*(?:doller|dollar|\$|usd|taka|tk)\s*per/i);
  if (rateMatch) {
    rate = parseFloat(rateMatch[1]);
  }

  const qtyMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:hour|hrs|ghanta|ghonta|days|qty|units)/i);
  if (qtyMatch) {
    quantity = parseFloat(qtyMatch[1]);
  }

  // Determine Service Description
  let serviceDesc = "Web Development Service";
  if (/landing\s*page/i.test(text)) {
    serviceDesc = "Landing Page Web Development";
  } else if (/ui|ux|design/i.test(text)) {
    serviceDesc = "UI/UX Interface Design";
  } else if (/app|mobile/i.test(text)) {
    serviceDesc = "Mobile Application Development";
  }

  result.items.push({
    description: serviceDesc,
    quantity: quantity,
    rate: rate
  });

  return result;
}
