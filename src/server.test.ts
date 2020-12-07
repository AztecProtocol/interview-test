import { Server } from './server';
import { LocalBlockSource } from './block_source/local_block_source';
import levelup from 'levelup';
import memdown from 'memdown';
import { InternalWorldStateDb } from './world_state_db';
import { Block } from './block_source';
import { HashPath } from './merkle_tree';

describe('server test', () => {
  let server: Server;
  let worldStateDb: InternalWorldStateDb;
  let blockSource: LocalBlockSource;

  const randomBlock = (id: number): Block => ({
    id,
    dataStartIndex: id * 2,
    created: new Date(),
    leafData: [Buffer.alloc(32, id * 2), Buffer.alloc(32, id * 2 + 1)],
  });
});
