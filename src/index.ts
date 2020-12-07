import 'reflect-metadata';
import 'source-map-support/register';
import 'log-timestamp';
import http from 'http';
import { appFactory } from './app';
import { Server } from './server';
import { mkdirp } from 'fs-extra';
import levelup from 'levelup';
import leveldown from 'leveldown';
import { InternalWorldStateDb } from './world_state_db';
import { LocalBlockSource } from './block_source/local_block_source';

const { PORT = '8080', API_PREFIX = '' } = process.env;

async function main() {
  const shutdown = async () => process.exit(0);
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);

  await mkdirp('./data');
  const db = levelup(leveldown('./data/world_state.db'));
  const worldStateDb = new InternalWorldStateDb(db);
  const blockSource = new LocalBlockSource('./data/blocks');

  await worldStateDb.init();

  const server = new Server(worldStateDb, blockSource);
  await server.start();

  const app = appFactory(server, API_PREFIX);

  const httpServer = http.createServer(app.callback());
  httpServer.listen(PORT);
  console.log(`Server listening on port ${PORT}.`);
}

main().catch(console.log);
