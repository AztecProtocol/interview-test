import { HashPath } from '../merkle_tree';

/**
 * Provides an abstraction for whatever underlying implementation is saving the tree state.
 */
export interface WorldStateDb {
  getRoot(): Buffer;
  getSize(): number;
  get(index: number): Promise<Buffer>;
  getHashPath(index: number): Promise<HashPath>;
  put(index: number, value: Buffer): Promise<Buffer>;
}
