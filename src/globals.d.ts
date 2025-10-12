/**
 * Global type definitions for third-party libraries loaded via CDN.
 */

interface JSZipFile {
  name: string;
  dir: boolean;
  date: Date;
  comment: string;
  async(type: 'string'): Promise<string>;
  async(type: 'arraybuffer'): Promise<ArrayBuffer>;
  async(type: 'blob'): Promise<Blob>;
}

interface JSZipFolder {
  file(name: string, data: string | ArrayBuffer | Blob): JSZipFolder;
  folder(name: string): JSZipFolder;
}

interface JSZip extends JSZipFolder {
  generateAsync(options: {
    type: 'blob' | 'arraybuffer' | 'uint8array' | 'binarystring';
    compression?: 'DEFLATE' | 'STORE';
    compressionOptions?: { level: number };
  }): Promise<Blob>;
}

interface JSZipConstructor {
  new (): JSZip;
}

declare const JSZip: JSZipConstructor;

declare function saveAs(
  data: Blob | File,
  filename?: string,
  disableAutoBOM?: boolean
): void;
