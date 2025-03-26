import { writeFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const fileBuffer = await file.arrayBuffer();
  const filePath = join(process.cwd(), "public/uploads", file.name);
  
  await writeFile(filePath, Buffer.from(fileBuffer));

  return NextResponse.json({ url: `/uploads/${file.name}` });
}
