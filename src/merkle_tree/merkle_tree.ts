import { LevelUp, LevelUpChain } from 'levelup';
import { Hasher } from './hasher';
import { HashPath } from './hash_path';

export class MerkleTree {
  /**
   * Constructs a new MerkleTree instance with the given `name`.
   */
  static async new(db: LevelUp, hasher: Hasher, name: string, depth: number) {
    return new MerkleTree();
  }

  /**
   * Constructs a new MerkleTree instance from existing data identified by `name`.
   */
  static async fromName(db: LevelUp, hasher: Hasher, name: string) {
    return new MerkleTree();
  }

  getRoot() {
    return Buffer.alloc(0);
  }

  getSize() {
    return 0;
  }

  async getElement(index: number) {
    return Buffer.alloc(0);
  }

  async getHashPath(index: number) {
    return new HashPath();
  }

  async updateElement(index: number, value: Buffer) {}
}
