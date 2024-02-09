import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import * as M from 'fp-ts/Map';
import * as E from 'fp-ts/Either';
import * as S from 'fp-ts/Set';
import * as String from 'fp-ts/string';
import { pipe, flip } from 'fp-ts/function';
import { evolve } from 'fp-ts/struct';


type Node = string;
type Edge = [Node, Node];
type EdgeList = Edge[];
// A basic directed graph as a connection list
export type Graph = Map<Node, Node[]>;
// A directed graph with a set of all starting nodes
export interface FullGraph {
    graph: Graph;
    nodes: Set<string>;
}

const emptyGraph = () => ({
    graph: new Map<Node, Node[]>,
    nodes: new Set<string>(),
})

const lookup = M.lookup(String.Eq);
const upsertAt = M.upsertAt(String.Eq);

const addEdgeToGraph = ([f, t]: Edge) => (g: Graph): Graph => {
    return pipe(
        g,
        lookup(f),
        O.match(
            () => [t],
            A.append(t)
        ),
        (a) => upsertAt(f, a)(g)
    );
};

const addEdgeToNodes = ([f]: Edge) => S.insert(String.Eq)(f);

const addEdge = (g: FullGraph, e: Edge): FullGraph => pipe(
    g,
    evolve({
        graph: addEdgeToGraph(e),
        nodes: addEdgeToNodes(e),
    }),
);

const edgeStringToEdge = (s: string): E.Either<Error, Edge> => {
    const [l, r] = s.split('->');
    if (!l || !r) return E.left(new Error('Failed to parse edge'));
    return E.right([l, r]);
}

const stringToList = (s: string): E.Either<Error, EdgeList> => {
    return pipe(
        s.split(','),
        A.traverse(E.Applicative)(edgeStringToEdge),
    );
};

const listToGraph = (l: EdgeList): FullGraph => {
    return pipe(
        l,
        A.reduce<Edge, FullGraph>(emptyGraph(), addEdge),
        // A.reduce<Edge, Graph>({}, (g, [f,t]) => g[f] ? { ...g, [f]: [...g[f], t] } : { ...g, [f]: [t] }),
    );
}

export const parseGraph = (s: string): E.Either<Error, FullGraph> => {
    return pipe(
        s,
        stringToList,
        E.map(listToGraph),
    );
}

export const bfs = (g: FullGraph) => (start: Node) => { //[current, ...tail]: Node[], seen: Map<string, number>) => {
    console.log('start');
    const aux = ([head, ...tail]: [Node, number][], acc: Map<string, number>): Map<string, number> => {
        if (!head) return acc;
        const [current, dist] = head;
        if (acc.has(current)) return aux(tail, acc);
        const withNeighbors = pipe(
            g.graph,
            lookup(current),
            O.match<Node[], [Node, number][]>(
                () => [],
                A.map(n => [n, dist + 1]),
            ),
            flip(A.concat)(tail),
        );
        const withHead = upsertAt(current, dist);
        return aux(withNeighbors, withHead(acc));
    };

    const result = aux([[start, 0]], new Map<string, number>());

    return result;
}

export type Path = [string, string, number];

export const bfsFull = (g: FullGraph): Path[] => {
    const nodes = g.nodes;

    return pipe(
        nodes,
        S.toArray(String.Ord),
        A.map(n => pipe(
            n,
            bfs(g),
            M.toArray(String.Ord),
            A.map<[string, number], Path>(([k, b]) => [n, k, b]),
        )),
        A.flatten,
    )
}

