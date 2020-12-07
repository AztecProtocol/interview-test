import { Sha256Hasher } from './sha256_hasher';

export class HashPath {
  constructor(public data: Buffer[][] = []) {}

  public toBuffer() {
    return Buffer.concat(this.data.flat());
  }

  /**
   * Creates a new `HashPath` instance from a buffer previously created from `toBuffer`.
   */
  static fromBuffer(buf: Buffer) {}

  /**
   * Validates (returns true or false), that the merkle tree represented by `root`, constains `leafData` at `index`.
   */
  validate(root: Buffer, index: number, leafData: Buffer, hasher = new Sha256Hasher()) {}
}
