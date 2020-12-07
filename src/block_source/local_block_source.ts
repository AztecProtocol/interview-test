import { BlockSource, Block } from '.';
import { EventEmitter } from 'events';
import { readJson, writeJson } from 'fs-extra';

export interface JsonBlock {
  id: number;
  created: string;
  dataStartIndex: number;
  leafData: string;
}

const toBlock = (block: JsonBlock): Block => {
  const leafDataBuf = Buffer.from(block.leafData, 'hex');
  return {
    id: block.id,
    created: new Date(block.created),
    dataStartIndex: block.dataStartIndex,
    leafData: [...new Array(block.leafData.length / 32)].map((e, i) => leafDataBuf.slice(i * 32, i * 32 + 32)),
  };
};

const toJsonBlock = (block: Block): JsonBlock => {
  const leafData = Buffer.concat(block.leafData).toString('hex');
  return {
    id: block.id,
    created: block.created.toISOString(),
    dataStartIndex: block.dataStartIndex,
    leafData,
  };
};

export class LocalBlockSource extends EventEmitter implements BlockSource {
  private blocks: Block[] = [];

  constructor(private dataPath?: string) {
    super();
  }

  public async start(from = 0) {
    if (this.dataPath) {
      const blocksJson: JsonBlock[] = await readJson(this.dataPath).catch(() => []);
      this.blocks = blocksJson.map(toBlock);
    }

    this.blocks.slice(from).forEach(b => this.emit('block', b));
  }

  public stop() {
    this.removeAllListeners();
  }

  public async getBlocks(from: number) {
    return this.blocks.slice(from, from + 5);
  }

  /**
   * Called to simulate the arrival of a new block.
   */
  public async addBlock(block: Block) {
    this.blocks.push(block);

    if (this.dataPath) {
      await writeJson(this.dataPath, this.blocks.map(toJsonBlock));
    }

    this.emit('block', block);
  }
}
