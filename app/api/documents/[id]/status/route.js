import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { status, type } = await request.json();

    const doc = await prisma.invoiceOrQuote.findUnique({
      where: { id },
    });

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Document not found." },
        { status: 404 }
      );
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (type) updateData.type = type;

    // If status is updated to PAID, ensure paidAmount matches totalAmount if not set
    if (status === "PAID" && doc.paidAmount === 0) {
      updateData.paidAmount = doc.totalAmount;
    }

    const updatedDoc = await prisma.invoiceOrQuote.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedDoc,
    });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update document status." },
      { status: 500 }
    );
  }
}
