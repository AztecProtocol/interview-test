export interface Hasher {
  /**
   * Given two roots, the left hand subtree root, and the right hand subtree root, return a digest representing
   * the new tree root.
   */
  compress(lhs: Buffer, rhs: Buffer): Buffer;

  /**
   * Given `data` which is to be become an entry in the tree, return a digest that represents that data.
   */
  hash(data: Buffer): Buffer;
}
