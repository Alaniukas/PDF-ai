export function detectImageMime(buffer: Buffer): string {
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    return "image/jpeg";
  }
  if (buffer.length >= 8 && buffer[0] === 0x89 && buffer[1] === 0x50) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer.slice(0, 4).toString("ascii") === "RIFF" &&
    buffer.slice(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  return "image/png";
}

export function mimeToExt(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/webp") return "webp";
  return "png";
}

export function imageContentType(file: File, ext: string, buffer?: Buffer): string {
  if (file.type && ["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return file.type;
  }
  if (buffer && buffer.length > 0) {
    return detectImageMime(buffer);
  }
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "webp") return "image/webp";
  return "image/png";
}

export function normalizeImageFile(file: File, index: number): File {
  const type =
    file.type && file.type.startsWith("image/") ? file.type : "image/png";
  const ext = mimeToExt(type);
  const name =
    file.name && file.name.includes(".")
      ? file.name
      : `screenshot-${Date.now()}-${index}.${ext}`;

  if (file.name === name && file.type === type) return file;
  return new File([file], name, { type });
}
