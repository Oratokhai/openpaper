// Uploads an image to /api/upload (Vercel Blob in prod, local public/uploads in
// dev) and returns its public URL. Throws with a readable message on failure.
export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/upload", { method: "POST", body: form });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Upload failed");
  }
  const { url } = (await res.json()) as { url: string };
  return url;
}
