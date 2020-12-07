import { HashPath } from '../merkle_tree';

export interface WorldStateDb {
  getRoot(): Buffer;
  getSize(): number;
  get(index: number): Promise<Buffer>;
  getHashPath(index: number): Promise<HashPath>;
  put(index: number, value: Buffer): Promise<Buffer>;
}
