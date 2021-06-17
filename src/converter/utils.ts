import { Block } from 'store/types/blocks';
import { Link } from 'store/types/networks';

export type FromBlockCenteredGraph = { [fromBlockID: string]: string[] };

export default function CreateGraph(
  links: { [id: string]: Link },
  blocks: { [id: string]: Block },
): {
  graph: FromBlockCenteredGraph;
  partBlocks: string[];
  nonPartBlocks: string[];
} {
  const fromBlockCenteredGraph: FromBlockCenteredGraph = {};
  let participatingBlocks: string[] = [];
  let nonParticipatingBlocks: string[] = [];
  for (const link of Object.values(links)) {
    participatingBlocks.push(...[link.from, link.to]);
    if (!fromBlockCenteredGraph[link.from]) {
      fromBlockCenteredGraph[link.from] = [];
    }
    fromBlockCenteredGraph[link.from].push(link.to);
  }
  participatingBlocks = participatingBlocks.filter((v, i) => participatingBlocks.indexOf(v) === i);
  nonParticipatingBlocks = Object.keys(blocks).filter((blockID) => !participatingBlocks.includes(blockID));
  return {
    graph: fromBlockCenteredGraph,
    partBlocks: participatingBlocks,
    nonPartBlocks: nonParticipatingBlocks,
  };
}

export function IncomingDegree(graph: FromBlockCenteredGraph) {
  const fromBlocks = Object.keys(graph);
  const inDegree = {};
  for (const fromBlock of fromBlocks) {
    for (const toBlock of graph[fromBlock]) {
      inDegree[toBlock] = inDegree[toBlock] + 1 || 1;
    }
  }

  const queue = fromBlocks.filter((fromBlock) => !inDegree[fromBlock]);
  const topologicalIndice = {};
  let index = 0;
  while (queue.length) {
    const fromBlock = queue.shift();
    index += 1;
    topologicalIndice[index] = fromBlock;
    if (graph[fromBlock]) {
      for (const toBlock of graph[fromBlock]) {
        inDegree[toBlock] -= 1;
        if (inDegree[toBlock] === 0) {
          queue.push(toBlock);
        }
      }
    }
  }

  if (index === fromBlocks.length) {
    // TODO(genesis.kim): Warning for detecting a cycle nodes.
    console.log('Detected a cycle');
  }

  return topologicalIndice;
}
