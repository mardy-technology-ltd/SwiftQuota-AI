import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { paymentMethod, trxId, paidAmount, senderPhone, note } = body;

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
