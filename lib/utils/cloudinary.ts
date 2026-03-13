/**
 * Extracts the public_id from a Cloudinary URL.
 * e.g. "https://res.cloudinary.com/cloud/image/upload/v123/folder/abc.jpg" → "folder/abc"
 */
export function extractPublicId(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Deletes an image from Cloudinary by its secure URL.
 * Requires CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET env vars.
 */
export async function deleteCloudinaryImage(photoUrl: string): Promise<void> {
  const publicId = extractPublicId(photoUrl);
  if (!publicId) return;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('Cloudinary credentials not configured, skipping image deletion');
    return;
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();

  const { createHash } = await import('crypto');
  const signature = createHash('sha1')
    .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest('hex');

  const formData = new URLSearchParams({
    public_id: publicId,
    timestamp,
    api_key: apiKey,
    signature,
  });

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    { method: 'POST', body: formData },
  );

  if (!res.ok) {
    console.error('Failed to delete Cloudinary image:', await res.text());
  }
}
