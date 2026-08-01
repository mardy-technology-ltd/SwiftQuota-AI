import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const documents = await prisma.invoiceOrQuote.findMany({
      include: {
        client: true,
        user: {
          select: {
            businessName: true,
            email: true,
            currency: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents from database' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      number,
      type,
      status,
      issuedDate,
      dueDate,
      items,
      taxRate,
      discount,
      totalAmount,
      clientId,
    } = body;

    // Default user fallback
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'admin@swiftquote.ai',
          passwordHash: 'EliteStandard2026!',
          businessName: 'Apex Creative Agency',
        },
      });
    }

    // Default client fallback if not provided
    let targetClientId = clientId;
    if (!targetClientId) {
      let firstClient = await prisma.client.findFirst();
      if (!firstClient) {
        firstClient = await prisma.client.create({
          data: {
            name: 'Default Client',
            email: 'client@example.com',
            userId: user.id,
          },
        });
      }
      targetClientId = firstClient.id;
    }

    // Process and validate items array
    let itemsArray = [];
    if (typeof items === 'string') {
      try {
        itemsArray = JSON.parse(items);
      } catch {
        itemsArray = [];
      }
    } else if (Array.isArray(items)) {
      itemsArray = items;
    }

    // Server-side calculation of total amount for accuracy
    const subtotal = itemsArray.reduce((sum, item) => {
      const q = parseFloat(item.quantity) || 0;
      const r = parseFloat(item.rate) || 0;
      return sum + q * r;
    }, 0);

    const taxVal = parseFloat(taxRate) || 0;
    const discountVal = parseFloat(discount) || 0;

    const taxAmount = subtotal * (taxVal / 100);
    const discountAmount = subtotal * (discountVal / 100);
    const calculatedTotal = subtotal + taxAmount - discountAmount;

    const finalTotal = typeof totalAmount === 'number' ? totalAmount : calculatedTotal;

    const newDocument = await prisma.invoiceOrQuote.create({
      data: {
        number: number || `SQ-${Math.floor(1000 + Math.random() * 9000)}`,
        type: type || 'ESTIMATE',
        status: status || 'SENT',
        issuedDate: issuedDate ? new Date(issuedDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: JSON.stringify(itemsArray),
        taxRate: taxVal,
        discount: discountVal,
        totalAmount: finalTotal,
        clientId: targetClientId,
        userId: user.id,
      },
      include: {
        client: true,
      },
    });

    return NextResponse.json({ success: true, data: newDocument });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save document to database' },
      { status: 500 }
    );
  }
}
