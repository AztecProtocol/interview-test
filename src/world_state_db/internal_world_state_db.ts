import { MerkleTree } from '../merkle_tree';
import { WorldStateDb } from './world_state_db';
import { Sha256Hasher } from '../merkle_tree/sha256_hasher';
import { LevelUp } from 'levelup';

export class InternalWorldStateDb implements WorldStateDb {
  private tree!: MerkleTree;

  constructor(private db: LevelUp) {}

  async init() {
    this.tree = await MerkleTree.new(this.db, new Sha256Hasher(), 'data_tree', 32);
  }

  getRoot(): Buffer {
    return this.tree.getRoot();
  }

  getSize(): number {
    return this.tree.getSize();
  }

  async get(index: number) {
    return this.tree.getElement(index);
  }

  async getHashPath(index: number) {
    return this.tree.getHashPath(index);
  }

  async put(index: number, value: Buffer) {
    await this.tree.updateElement(index, value);
    return this.getRoot();
  }
}
