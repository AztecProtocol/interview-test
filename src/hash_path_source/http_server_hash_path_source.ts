import { HashPath } from '../merkle_tree';
import { HashPathSource } from './hash_path_source';
import fetch from 'node-fetch';
import { URL } from 'url';

export interface GetHashPathServerResponse {
  hashPath: string;
}

export interface GetTreeStateServerResponse {
  root: string;
  size: number;
}

/**
 * Implementation of HashPathSource that will use a backend server to fetch and return data.
 */
export class HttpServerHashPathSource implements HashPathSource {
  private baseUrl: string;

  constructor(baseUrl: URL) {
    this.baseUrl = baseUrl.toString().replace(/\/$/, '');
  }

  public async getTreeState() {
    return { root: Buffer.alloc(0), size: 0 };
  }

  public async getHashPath(index: number) {
    return new HashPath();
  }
}
