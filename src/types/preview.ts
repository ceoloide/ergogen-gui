/**
 * Interface for a preview object.
 * @interface Preview
 * @property {string} extension - The file extension of the preview content.
 * @property {string} key - A unique key for the preview.
 * @property {string} content - The content of the preview.
 */
export interface Preview {
  extension: string;
  key: string;
  content: string | ArrayBuffer | Uint8Array;
}
