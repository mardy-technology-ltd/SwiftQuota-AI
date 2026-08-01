import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Verify against DB user or default fallback
    const user = await prisma.user.findUnique({
      where: { email },
    });

    const isValid =
      (user && user.passwordHash === password) ||
      (email === 'admin@swiftquote.ai' && password === 'EliteStandard2026!');

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: { email: user?.email || email, name: user?.businessName || 'Admin User' },
    });

    response.cookies.set({
      name: 'auth_token',
      value: 'authenticated_user',
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
