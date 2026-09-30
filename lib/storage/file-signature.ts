/**
 * Content inspection from raw bytes ("magic numbers") plus lightweight image
 * dimension extraction. The browser-declared MIME type is never trusted.
 */

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const JPEG_SIGNATURE = [0xff, 0xd8, 0xff];
const PDF_SIGNATURE = [0x25, 0x50, 0x44, 0x46]; // %PDF

function startsWith(buffer: Buffer, bytes: number[], offset = 0): boolean {
  if (buffer.length < offset + bytes.length) return false;
  for (let i = 0; i < bytes.length; i++) {
    if (buffer[offset + i] !== bytes[i]) return false;
  }
  return true;
}

function asciiAt(buffer: Buffer, offset: number, text: string): boolean {
  if (buffer.length < offset + text.length) return false;
  return buffer.subarray(offset, offset + text.length).toString("ascii") === text;
}

/** Detect the real content type from bytes. Returns `null` for unknown data. */
export function sniffMimeType(buffer: Buffer): string | null {
  if (startsWith(buffer, PNG_SIGNATURE)) return "image/png";
  if (startsWith(buffer, JPEG_SIGNATURE)) return "image/jpeg";
  if (startsWith(buffer, PDF_SIGNATURE)) return "application/pdf";
  if (asciiAt(buffer, 0, "RIFF") && asciiAt(buffer, 8, "WEBP")) return "image/webp";
  return null;
}

/** Extract pixel dimensions from a PNG buffer (IHDR). */
function pngSize(buffer: Buffer): { width: number; height: number } | null {
  // signature(8) + length(4) + "IHDR"(4) + width(4) + height(4)
  if (buffer.length < 24 || !asciiAt(buffer, 12, "IHDR")) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

/** Extract pixel dimensions from a JPEG buffer by scanning to a SOF marker. */
function jpegSize(buffer: Buffer): { width: number; height: number } | null {
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = buffer[offset + 1];
    // Standalone markers without a length field.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    if (marker === 0xd9 || marker === 0xda) return null; // end of image / scan
    const length = buffer.readUInt16BE(offset + 2);
    if (length < 2) return null;
    // SOF0-SOF15 excluding DHT(C4), JPG(C8), DAC(CC)
    const isSof =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) {
      if (offset + 9 >= buffer.length) return null;
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  return null;
}

/** Extract pixel dimensions from a WEBP buffer (VP8 / VP8L / VP8X). */
function webpSize(buffer: Buffer): { width: number; height: number } | null {
  if (buffer.length < 30) return null;
  const chunk = buffer.subarray(12, 16).toString("ascii");

  if (chunk === "VP8X") {
    const width = 1 + buffer.readUIntLE(24, 3);
    const height = 1 + buffer.readUIntLE(27, 3);
    return { width, height };
  }

  if (chunk === "VP8L") {
    if (buffer[20] !== 0x2f) return null;
    const bits = buffer.readUInt32LE(21);
    const width = (bits & 0x3fff) + 1;
    const height = ((bits >> 14) & 0x3fff) + 1;
    return { width, height };
  }

  if (chunk === "VP8 ") {
    // 3-byte frame tag + 3-byte start code
    if (buffer[23] !== 0x9d || buffer[24] !== 0x01 || buffer[25] !== 0x2a) return null;
    const width = buffer.readUInt16LE(26) & 0x3fff;
    const height = buffer.readUInt16LE(28) & 0x3fff;
    return { width, height };
  }

  return null;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

/** Extract width/height for supported image formats. `null` when unknown. */
export function extractImageDimensions(
  buffer: Buffer,
  mimeType: string,
): ImageDimensions | null {
  try {
    switch (mimeType) {
      case "image/png":
        return pngSize(buffer);
      case "image/jpeg":
        return jpegSize(buffer);
      case "image/webp":
        return webpSize(buffer);
      default:
        return null;
    }
  } catch {
    return null;
  }
}
