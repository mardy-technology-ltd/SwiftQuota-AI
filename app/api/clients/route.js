import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, address } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
    }

    // Get default user
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

    const newClient = await prisma.client.create({
      data: {
        name,
        email,
        phone: phone || '',
        address: address || '',
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, data: newClient });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ success: false, error: 'Failed to create client' }, { status: 500 });
  }
}
