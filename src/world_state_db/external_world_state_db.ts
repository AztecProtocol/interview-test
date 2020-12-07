import { HashPath } from '../merkle_tree';
import { ChildProcess, spawn } from 'child_process';
import { PromiseReadable } from 'promise-readable';
import { WorldStateDb } from '.';

function numToUInt32BE(n: number, bufferSize = 4) {
  const buf = Buffer.alloc(bufferSize);
  buf.writeUInt32BE(n, bufferSize - 4);
  return buf;
}

enum Cmd {
  GET = 0,
  PUT = 1,
  GET_HASH_PATH = 2,
}

/**
 * For a more advanced solution, you can develop a C++/Rust binary implementation of a merkle tree.
 * This provides a wrapper class that can communicate with an external process over stdin and stdout.
 * Point `binPath` to the external binary.
 */
export class ExternalWorldStateDb implements WorldStateDb {
  private proc?: ChildProcess;
  private stdout!: { read: (size: number) => Promise<Buffer> };
  private root = Buffer.alloc(0);
  private size = 0;
  private binPath = './db_cli';

  public async start() {
    const proc = (this.proc = spawn(this.binPath));

    proc.stderr.on('data', () => {});
    proc.on('close', code => {
      this.proc = undefined;
      if (code) {
        console.log(`db_cli exited with unexpected code ${code}.`);
      }
    });

    proc.on('error', console.log);

    this.stdout = new PromiseReadable(this.proc!.stdout!) as any;

    await this.readMetadata();
  }

  public stop() {
    if (this.proc) {
      this.proc.kill('SIGINT');
    }
  }

  public getRoot() {
    return this.root;
  }

  public getSize() {
    return this.size;
  }

  public async get(index: number): Promise<Buffer> {
    const buffer = Buffer.concat([Buffer.from([Cmd.GET]), numToUInt32BE(index)]);

    this.proc!.stdin!.write(buffer);

    const lengthBuf = await this.stdout.read(4);
    if (!lengthBuf) {
      throw new Error('Failed to read length.');
    }

    const length = lengthBuf.readUInt32BE(0);

    const result = await this.stdout.read(length);

    return result;
  }

  public async getHashPath(index: number): Promise<HashPath> {
    const buffer = Buffer.concat([Buffer.from([Cmd.GET_HASH_PATH]), numToUInt32BE(index)]);

    this.proc!.stdin!.write(buffer);

    const depth = (await this.stdout.read(4)).readUInt32BE(0);
    const result = await this.stdout.read(depth * 64);

    const path = new HashPath();
    for (let i = 0; i < depth; ++i) {
      const lhs = result.slice(i * 64, i * 64 + 32);
      const rhs = result.slice(i * 64 + 32, i * 64 + 64);
      path.data.push([lhs, rhs]);
    }
    return path;
  }

  public async put(index: number, value: Buffer): Promise<Buffer> {
    const buffer = Buffer.concat([Buffer.from([Cmd.PUT]), numToUInt32BE(index), numToUInt32BE(value.length)]);

    this.proc!.stdin!.write(Buffer.concat([buffer, value]));

    this.root = await this.stdout.read(32);

    if (index + 1 > this.size) {
      this.size = index + 1;
    }

    return this.root;
  }

  private async readMetadata() {
    this.root = await this.stdout.read(32);
    const dataSize = await this.stdout.read(4);
    this.size = dataSize.readUInt32BE(0);
  }
}
