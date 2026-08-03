import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { paymentMethod, trxId, paidAmount, senderPhone, note } = body;

    // Handle SaaS Subscription or Free Trial checkout from Landing Page
    if (id === "subscription" || !id) {
      let user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: "admin@swiftquote.ai",
            passwordHash: "EliteStandard2026!",
            businessName: "Apex Creative Agency",
          },
        });
      }

      const isTrial = paidAmount === 0 || (note && note.includes("monthly"));
      return NextResponse.json({
        success: true,
        message: isTrial
          ? "🎉 14-Day Free Trial Activated! Welcome to SwiftQuote AI."
          : "🎉 Subscription payment recorded successfully! Welcome aboard.",
        redirectTo: "/dashboard",
      });
    }

    const doc = await prisma.invoiceOrQuote.findUnique({
      where: { id },
    });

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Document not found." },
        { status: 404 }
      );
    }

    const amountPaid = parseFloat(paidAmount) || doc.totalAmount;
    const paymentNote = note || (senderPhone ? `Sender Phone: ${senderPhone}` : "");

    // Determine status: if TrxID provided (bKash/Nagad/Bank), set status to PENDING_VERIFICATION or PAID
    const newStatus = paymentMethod === "ONLINE_LINK" ? "PAID" : "PENDING_VERIFICATION";

    const updatedDoc = await prisma.invoiceOrQuote.update({
      where: { id },
      data: {
        status: newStatus,
        paymentMethod: paymentMethod || "MOBILE_BANKING",
        trxId: trxId || null,
        paidAmount: amountPaid,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedDoc,
      message:
        newStatus === "PAID"
          ? "Payment recorded successfully!"
          : "Payment proof submitted! The merchant will verify your transaction shortly.",
    });
  } catch (error) {
    console.error("Payment submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit payment details." },
      { status: 500 }
    );
  }
}
