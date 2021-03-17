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

  beforeEach(async () => {
    const db = levelup(memdown());
    worldStateDb = new InternalWorldStateDb(db);
    blockSource = new LocalBlockSource();
    server = new Server(worldStateDb, blockSource);
    await worldStateDb.init();
  });

  afterEach(async () => {
    await server.stop();
  });

  it('should sync with new blocks', async () => {
    await server.start();

    expect((await server.getTreeState()).size).toBe(0);

    await blockSource.addBlock(randomBlock(0));
    await blockSource.addBlock(randomBlock(1));

    const { size, root } = await server.getTreeState();
    expect(size).toBe(4);
    expect(root.toString('hex')).toEqual('d75b9c13d280c162faa7fa330e8b424c67dcb6d4c6aa0345e3681016a3a2c446');
  });

  // Write more tests.
});
