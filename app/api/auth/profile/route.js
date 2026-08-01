import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
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

    return NextResponse.json({
      success: true,
      data: {
        email: user.email,
        businessName: user.businessName,
        phone: user.phone || '',
        address: user.address || '',
        currency: user.currency || 'USD',
        taxRate: user.taxRate || 0,
        paymentDetails: user.paymentDetails || '',
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { email, businessName, phone, address, currency, taxRate, paymentDetails } = await request.json();

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

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: email !== undefined ? email : user.email,
        businessName: businessName !== undefined ? businessName : user.businessName,
        phone: phone !== undefined ? phone : user.phone,
        address: address !== undefined ? address : user.address,
        currency: currency !== undefined ? currency : user.currency,
        taxRate: taxRate !== undefined ? parseFloat(taxRate) : user.taxRate,
        paymentDetails: paymentDetails !== undefined ? paymentDetails : user.paymentDetails,
      }
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
  }
}
