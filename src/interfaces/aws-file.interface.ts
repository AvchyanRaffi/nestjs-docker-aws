export interface IAwsFile {
  size: number;
  buffer: Buffer;
  path: string;
  name: string;
  originalName?: string;
}
