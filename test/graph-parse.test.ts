import * as E from 'fp-ts/Either';
import { parseGraph, bfs, bfsFull } from '../src/graph-parse';

describe('graph-parse', () => {
	it('should parse a graph', () => {
		const result = parseGraph('Chicago->Urbana,Urbana->Springfield,Chicago->Lafayette');
    expect(E.isRight(result)).toBeTruthy();
    // @ts-ignore
    console.log(result.right);
  });
});

describe('bfs', () => {
})

describe('bfs', () => {
  test('simple', () => {
	  const result = parseGraph('Chicago->Urbana,Urbana->Springfield,Chicago->Lafayette');
    // @ts-ignore
    const fullGraph = result.right;
    const resultBfs = bfs(fullGraph)('Chicago');

    console.log(resultBfs);
  });

  test('full', () => {
	  const result = parseGraph('Chicago->Urbana,Urbana->Springfield,Chicago->Lafayette');
    // @ts-ignore
    const fullGraph = result.right;
    const fullSearch = bfsFull(fullGraph);
    console.log(fullSearch);
  });

  test('big', () => {
    const result = parseGraph('Chicago->Urbana,Urbana->Springfield,Chicago->Lafayette,Urbana->Node4,Springfield->Node5,Lafayette->Node6,Node4->Node7,Node5->Node8,Node6->Node9,Node7->Node10');
    // @ts-ignore
    const fullGraph = result.right;
    const fullSearch = bfsFull(fullGraph);
    console.log(fullSearch);
  })
})
