const STORAGE_KEY = "echt_pending_upload";

type PendingUploadPayload = {
  name: string;
  type: string;
  dataUrl: string;
};

export async function stashPendingUpload(file: File): Promise<void> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file."));
    reader.readAsDataURL(file);
  });

  const payload: PendingUploadPayload = {
    name: file.name,
    type: file.type,
    dataUrl,
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export async function consumePendingUpload(): Promise<File | null> {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  sessionStorage.removeItem(STORAGE_KEY);

  try {
    const { name, type, dataUrl } = JSON.parse(raw) as PendingUploadPayload;
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], name, { type: type || blob.type });
  } catch {
    return null;
  }
}
