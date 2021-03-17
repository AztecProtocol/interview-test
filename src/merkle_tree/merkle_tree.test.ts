import { MerkleTree, HashPath } from '.';
import { Sha256Hasher } from './sha256_hasher';
import levelup from 'levelup';
import memdown from 'memdown';

describe('merkle_tree', () => {
  let hasher!: Sha256Hasher;
  const values: Buffer[] = [];

  beforeAll(async () => {
    hasher = new Sha256Hasher();

    for (let i = 0; i < 10; ++i) {
      const v = Buffer.alloc(64, 0);
      v.writeUInt32LE(i, 0);
      values[i] = v;
    }
  });

  it('should have correct empty tree root for depth 32', async () => {
    const db = levelup(memdown());
    const tree = await MerkleTree.new(db, hasher, 'test', 32);
    const root = tree.getRoot();
    expect(root.toString('hex')).toEqual('1c9a7e5ff1cf48b4ad1582d3f4e4a1004f3b20d8c5a2b71387a4254ad933ebc5');
  });

  it('should have correct root', async () => {
    const db = levelup(memdown());

    const e00 = hasher.hash(values[0]);
    const e01 = hasher.hash(values[1]);
    const e02 = hasher.hash(values[2]);
    const e03 = hasher.hash(values[3]);
    const e10 = hasher.compress(e00, e01);
    const e11 = hasher.compress(e02, e03);
    const root = hasher.compress(e10, e11);

    const tree = await MerkleTree.new(db, hasher, 'test', 2);

    for (let i = 0; i < 4; ++i) {
      await tree.updateElement(i, values[i]);
    }

    for (let i = 0; i < 4; ++i) {
      expect(await tree.getElement(i)).toEqual(values[i]);
    }

    let expected = new HashPath([
      [e00, e01],
      [e10, e11],
    ]);

    expect(await tree.getHashPath(0)).toEqual(expected);
    expect(await tree.getHashPath(1)).toEqual(expected);

    expected = new HashPath([
      [e02, e03],
      [e10, e11],
    ]);

    expect(await tree.getHashPath(2)).toEqual(expected);
    expect(await tree.getHashPath(3)).toEqual(expected);
    expect(tree.getRoot()).toEqual(root);
    expect(tree.getSize()).toBe(4);

    expect(root).toEqual(Buffer.from('e645e6b5445483a358c4d15c1923c616a0e6884906b05c196d341ece93b2de42', 'hex'));
  });

  // Write more tests.
});
