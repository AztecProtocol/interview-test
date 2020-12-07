export interface Hasher {
  compress(lhs: Buffer, rhs: Buffer): Buffer;
  hash(data: Buffer): Buffer;
}
