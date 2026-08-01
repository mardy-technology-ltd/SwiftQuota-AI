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
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 });
  }
}
