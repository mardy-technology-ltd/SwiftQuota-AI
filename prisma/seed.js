import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean up existing data
  await prisma.invoiceOrQuote.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // Create User
  const user = await prisma.user.create({
    data: {
      email: 'admin@swiftquote.ai',
      passwordHash: 'EliteStandard2026!',
      businessName: 'Apex Creative Agency',
      address: '789 Enterprise Way, Suite 400, Austin, TX 78701',
      phone: '+1 (512) 555-0100',
      currency: 'USD',
      taxRate: 10.0,
      paymentDetails: 'Stripe: https://buy.stripe.com/mock_apex_creative | Bank Transfer: ACH routing 123456789',
    },
  });

  // Create Clients
  const john = await prisma.client.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 555-0192',
      address: '123 Tech Lane, San Francisco, CA 94105',
      userId: user.id,
    },
  });

  const jane = await prisma.client.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 555-0144',
      address: '456 Innovation Blvd, New York, NY 10001',
      userId: user.id,
    },
  });

  // Dates for mock documents
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fifteenDaysFromNow = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);

  // Document 1: Estimate (SENT)
  await prisma.invoiceOrQuote.create({
    data: {
      number: 'SQ-1001',
      type: 'ESTIMATE',
      status: 'SENT',
      dueDate: thirtyDaysFromNow,
      items: JSON.stringify([
        { description: 'UI/UX Design Services', quantity: 20, rate: 50 },
      ]),
      taxRate: 10.0,
      discount: 0.0,
      totalAmount: 1100.0,
      clientId: john.id,
      userId: user.id,
    },
  });

  // Document 2: Invoice (PAID)
  await prisma.invoiceOrQuote.create({
    data: {
      number: 'SQ-1002',
      type: 'INVOICE',
      status: 'PAID',
      dueDate: sevenDaysAgo,
      items: JSON.stringify([
        { description: 'Website Development', quantity: 1, rate: 1500 },
      ]),
      taxRate: 10.0,
      discount: 0.0,
      totalAmount: 1650.0,
      clientId: jane.id,
      userId: user.id,
    },
  });

  // Document 3: Estimate (SIGNED)
  await prisma.invoiceOrQuote.create({
    data: {
      number: 'SQ-1003',
      type: 'ESTIMATE',
      status: 'SIGNED',
      dueDate: fifteenDaysFromNow,
      items: JSON.stringify([
        { description: 'Branding Consulting', quantity: 5, rate: 100 },
      ]),
      taxRate: 10.0,
      discount: 0.0,
      totalAmount: 550.0,
      signaturePath: '/signatures/sig_sq1003_jane.png',
      signedAt: now,
      clientId: jane.id,
      userId: user.id,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
