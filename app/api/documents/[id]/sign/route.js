import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { signatureImage } = body;

    if (!signatureImage) {
      return NextResponse.json(
        { success: false, error: 'Signature image is required' },
        { status: 400 }
      );
    }

    const updatedDocument = await prisma.invoiceOrQuote.update({
      where: { id },
      data: {
        status: 'SIGNED',
        signaturePath: signatureImage,
        signedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: updatedDocument });
  } catch (error) {
    console.error('Error signing document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record signature' },
      { status: 500 }
    );
  }
}
