import { put } from "@vercel/blob";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Unified image upload for cover/banner images.
//
// • If a Vercel Blob store is connected (BLOB_READ_WRITE_TOKEN set), the file is
//   streamed to Blob and a permanent CDN URL is returned. This is the prod path.
// • Otherwise (local dev with no Blob store) the file is written to
//   `public/uploads/` and served as a static asset, so uploads work immediately
//   without any infra setup.
//
// The file is proxied through this server function, so we cap at 4 MB to stay
// under Vercel's 4.5 MB serverless request-body limit.
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const MAX_BYTES = 4 * 1024 * 1024;
const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: Request): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image must be under 4 MB" }, { status: 400 });
    }

    const ext = EXT[file.type] ?? "bin";
    const name = `${randomUUID()}.${ext}`;

    // Prod: Vercel Blob.
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${name}`, file, {
        access: "public",
        contentType: file.type,
      });
      return NextResponse.json({ url: blob.url });
    }

    // Dev fallback: write to public/uploads.
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, name), bytes);
    return NextResponse.json({ url: `/uploads/${name}` });
  } catch (err) {
    console.error("[upload] failed:", err);
    return NextResponse.json(
      { error: (err as Error).message ?? "Upload failed" },
      { status: 500 },
    );
  }
}
