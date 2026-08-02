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

    const isLocked = user.businessName !== 'Apex Creative Agency' && user.email !== 'admin@swiftquote.ai';

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
        bkashNumber: user.bkashNumber || '',
        nagadNumber: user.nagadNumber || '',
        bankDetails: user.bankDetails || '',
        paymentLink: user.paymentLink || '',
        logoUrl: user.logoUrl || '',
        stampUrl: user.stampUrl || '',
        taxId: user.taxId || '',
        isLocked,
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { email, businessName, phone, address, currency, taxRate, paymentDetails, bkashNumber, nagadNumber, bankDetails, paymentLink, logoUrl, stampUrl, taxId } = await request.json();

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

    // Lock condition: if already customized, do not allow further changes to businessName and email
    const isCurrentlyCustomized = user.businessName !== 'Apex Creative Agency' && user.email !== 'admin@swiftquote.ai';

    let finalBusinessName = user.businessName;
    let finalEmail = user.email;

    if (!isCurrentlyCustomized) {
      if (businessName !== undefined) finalBusinessName = businessName;
      if (email !== undefined) finalEmail = email;
    } else {
      if (businessName !== undefined && businessName !== user.businessName) {
        return NextResponse.json({ success: false, error: 'Business name is locked and cannot be changed.' }, { status: 400 });
      }
      if (email !== undefined && email !== user.email) {
        return NextResponse.json({ success: false, error: 'Email address is locked and cannot be changed.' }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: finalEmail,
        businessName: finalBusinessName,
        phone: phone !== undefined ? phone : user.phone,
        address: address !== undefined ? address : user.address,
        currency: currency !== undefined ? currency : user.currency,
        taxRate: taxRate !== undefined ? parseFloat(taxRate) : user.taxRate,
        paymentDetails: paymentDetails !== undefined ? paymentDetails : user.paymentDetails,
        bkashNumber: bkashNumber !== undefined ? bkashNumber : user.bkashNumber,
        nagadNumber: nagadNumber !== undefined ? nagadNumber : user.nagadNumber,
        bankDetails: bankDetails !== undefined ? bankDetails : user.bankDetails,
        paymentLink: paymentLink !== undefined ? paymentLink : user.paymentLink,
        logoUrl: logoUrl !== undefined ? logoUrl : user.logoUrl,
        stampUrl: stampUrl !== undefined ? stampUrl : user.stampUrl,
        taxId: taxId !== undefined ? taxId : user.taxId,
      }
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
  }
}

