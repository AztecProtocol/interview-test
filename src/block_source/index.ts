export interface Block {
  id: number;
  created: Date;
  dataStartIndex: number;
  leafData: Buffer[];
}

export interface BlockSource {
  /**
   * Returns up to 5 blocks from block id `from`.
   */
  getBlocks(from: number): Promise<Block[]>;

  /**
   * Starts emitting blocks from `fromBlock`.
   */
  start(fromBlock?: number): void;

  /**
   * Stops emitting blocks.
   */
  stop(): void;

  on(event: 'block', fn: (block: Block) => void): void;

  removeAllListeners(): void;
}
