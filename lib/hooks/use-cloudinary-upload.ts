import { useCallback } from 'react';

interface CloudinaryUploadResult {
  secure_url: string;
}

interface CloudinaryWidget {
  open: () => void;
}

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        config: Record<string, unknown>,
        callback: (error: unknown, result: { event: string; info: CloudinaryUploadResult }) => void,
      ) => CloudinaryWidget;
    };
  }
}

export function useCloudinaryUpload(onSuccess: (url: string) => void, onError?: (msg: string) => void): () => void {
  const openWidget = useCallback(() => {
    if (!window.cloudinary) {
      onError?.('Cloudinary widget not loaded yet. Please try again.');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        sources: ['local'],
        multiple: false,
        maxFileSize: 5000000,
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      },
      (error, result) => {
        if (error) {
          onError?.('Image upload failed. Please try again.');
          return;
        }
        if (result.event === 'success') {
          onSuccess(result.info.secure_url);
        }
      },
    );

    widget.open();
  }, [onSuccess, onError]);

  return openWidget;
}
