import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { rejectionReason } = body;

    if (!rejectionReason || !rejectionReason.trim()) {
      return NextResponse.json(
        { success: false, error: "Please provide a reason or revision note." },
        { status: 400 }
      );
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

    const updatedDoc = await prisma.invoiceOrQuote.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectionReason: rejectionReason.trim(),
        rejectedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedDoc,
      message: "Feedback submitted. The merchant has been notified of your revision request.",
    });
  } catch (error) {
    console.error("Rejection submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit rejection feedback." },
      { status: 500 }
    );
  }
}
