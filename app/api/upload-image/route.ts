import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import { env } from "@/lib/env";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

export async function POST(request: Request) {
  void env.BLOB_READ_WRITE_TOKEN;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image uploads are supported." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Image must be 4MB or smaller." }, { status: 400 });
  }

  const extension = file.name.split(".").pop() || "png";
  const filename = `token-art/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type
  });

  return NextResponse.json({ url: blob.url });
}
