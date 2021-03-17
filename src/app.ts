import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import Router from 'koa-router';
import { GetHashPathServerResponse, GetTreeStateServerResponse } from './hash_path_source';
import { Server } from './server';

/**
 * Creates and returns a Koa app that will serve hash tree state.
 * Nothing to modify here.
 */
export function appFactory(server: Server, prefix: string) {
  const router = new Router({ prefix });

  router.get('/', async (ctx: Koa.Context) => {
    ctx.body = 'OK\n';
    ctx.response.status = 200;
  });

  router.get('/get-tree-state', async (ctx: Koa.Context) => {
    const { size, root } = await server.getTreeState();
    const response: GetTreeStateServerResponse = {
      root: root.toString('hex'),
      size,
    };
    ctx.set('content-type', 'application/json');
    ctx.body = response;
    ctx.response.status = 200;
  });

  router.get('/get-hash-path/:index', async (ctx: Koa.Context) => {
    const index = ctx.params.index;
    const path = await server.getHashPath(index);
    const response: GetHashPathServerResponse = {
      hashPath: path.toBuffer().toString('hex'),
    };
    ctx.set('content-type', 'application/json');
    ctx.body = response;
    ctx.response.status = 200;
  });

  const app = new Koa();
  app.proxy = true;
  app.use(compress());
  app.use(cors());
  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}
