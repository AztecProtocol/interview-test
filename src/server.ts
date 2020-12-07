import { Block } from './block_source';
import { MemoryFifo } from './fifo';
import { HashPath } from './merkle_tree';
import { BlockSource } from './block_source';
import { HashPathSource, TreeState } from './hash_path_source';
import { WorldStateDb } from './world_state_db';

export class Server implements HashPathSource {
  public constructor(private worldStateDb: WorldStateDb, private blockSource: BlockSource) {}

  /**
   * Fully synchronises chain state before returning.
   * Starts processing of any new subsequent new blocks.
   */
  public async start() {}

  /**
   * Stops processing new blocks / requests, returns once everythings complete.
   */
  public async stop() {}

  getTreeState(): Promise<TreeState> {
    throw new Error('Method not implemented.');
  }

  getHashPath(index: number): Promise<HashPath> {
    throw new Error('Method not implemented.');
  }
}
