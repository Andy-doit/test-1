export interface PresignRequest {
  filename: string;
  contentType: string;
}

export interface PresignResponse {
  uploadUrl: string;
  key: string;
  fileUrl: string;
}

export const uploadsService = {
  /**
   * Upload a file directly to the local Next.js API route (/api/upload)
   * This saves the file into public/uploads folder like Strapi.
   */
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Upload failed: ${res.statusText}`);
    }

    const data = (await res.json()) as { url: string };
    return data.url;
  }
};
