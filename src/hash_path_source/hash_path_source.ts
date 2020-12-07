import { HashPath } from '../merkle_tree';

export interface TreeState {
  root: Buffer;
  size: number;
}

export interface HashPathSource {
  getTreeState(): Promise<TreeState>;
  getHashPath(index: number): Promise<HashPath>;
}
