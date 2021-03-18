import { LevelUp, LevelUpChain } from 'levelup';
import { Hasher } from './hasher';
import { HashPath } from './hash_path';

const MAX_DEPTH = 32;
const LEAF_BYTES = 64; // All leaf values are 64 bytes.

export class MerkleTree {
  /**
   * Constructs a new MerkleTree instance, either initializing an empty tree, or restoring pre-existing state values.
   *
   * @param db Underlying leveldb.
   * @param hasher Hasher for hashing leaf value, and compressing left/right node hashes.
   * @param name Name of the tree, to be used when restoring/persisting state.
   * @param depth The depth of the tree, to be no greater than MAX_DEPTH.
   * @param size When restoring, you need to provider the size.
   * @param root When restoring, you need to provide the root.
   */
  constructor(
    private db: LevelUp,
    private hasher: Hasher,
    private name: string,
    private depth: number,
    private size: number = 0,
    root?: Buffer,
  ) {}

  /**
   * Constructs a new MerkleTree instance with the given `name` and `depth`.
   */
  static async new(db: LevelUp, hasher: Hasher, name: string, depth: number) {
    return new MerkleTree(db, hasher, name, depth)
  }

  /**
   * Constructs a new MerkleTree instance from existing data identified by `name`.
   */
  static async fromName(db: LevelUp, hasher: Hasher, name: string) {}

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
