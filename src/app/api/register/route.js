import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.formData(); // Get form data
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const image = formData.get("image"); // Get uploaded image file

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already in use" }), { status: 400 });
    }

    let imagePath = null;
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public/uploads");
      const fileName = `${Date.now()}_${image.name}`;
      const filePath = path.join(uploadDir, fileName);

      // Save image to public/uploads
      await writeFile(filePath, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with image path
    await prisma.user.create({
      data: { name, email, password: hashedPassword, image: imagePath, provider: "credentials" },
    });

    return new Response(JSON.stringify({ message: "User registered successfully" }), { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
