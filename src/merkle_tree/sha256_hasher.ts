import { createHash } from 'crypto';
import { Hasher } from './hasher';

export class Sha256Hasher implements Hasher {
  compress(lhs: Buffer, rhs: Buffer): Buffer {
    return Buffer.alloc(0);
  }
  hash(data: Buffer): Buffer {
    return Buffer.alloc(0);
  }
}
