import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const session = await getServerSession(req);
    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const { street, city, state, country, zipCode } = await req.json();
    if (!street || !city || !state || !country || !zipCode) {
      return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    // Create address linked to user
    const address = await prisma.address.create({
      data: { street, city, state, country, zipCode, userId: user.id },
    });

    return new Response(JSON.stringify(address), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(req);
    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    // Get only logged-in user's addresses
    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
    });

    return new Response(JSON.stringify(addresses), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(req);
    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const { id, street, city, state, country, zipCode } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ message: "ID is required" }), { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    // Check if address belongs to the user
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== user.id) {
      return new Response(JSON.stringify({ message: "Address not found or unauthorized" }), { status: 403 });
    }

    // Update address
    const updatedAddress = await prisma.address.update({
      where: { id },
      data: { street, city, state, country, zipCode },
    });

    return new Response(JSON.stringify(updatedAddress), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(req);
    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ message: "ID is required" }), { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    // Check if address belongs to the user
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== user.id) {
      return new Response(JSON.stringify({ message: "Address not found or unauthorized" }), { status: 403 });
    }

    // Delete address
    await prisma.address.delete({ where: { id } });

    return new Response(JSON.stringify({ message: "Address deleted successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
