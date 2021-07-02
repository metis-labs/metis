// Metis
// Copyright 2021-present NAVER Corp.
// Apache License v2.0

import { Block, BlockType } from '../store/types/blocks';
import { Link } from '../store/types/networks';
import { FromBlockCenteredGraph } from './utils';

export default class ForwardConverter {
  private blocks: { [id: string]: Block };

  private bodyBlockIDs: string[];

  private readonly inBlockIDs: string[];

  private readonly outBlockIDs: string[];

  private result: string;

  private readonly indentSize: string;

  private readonly indentDepth: number;

  private readonly linkMapByFrom: { [fromId: string]: Link };

  constructor() {
    this.bodyBlockIDs = [];
    this.inBlockIDs = [];
    this.outBlockIDs = [];
    this.result = `\n\n`;
    this.indentSize = `    `;
    this.indentDepth = 1;
    this.linkMapByFrom = {};
  }

  orderBlocks(blocks: { [id: string]: Block }): void {
    // TODO: Implement block clustering method using links
    // TODO: Employ topological sort for block ordering
    const islandBodyBlockIDs = [];
    for (const [, blockItem] of Object.entries(blocks)) {
      if (blockItem.type === BlockType.In) {
        this.inBlockIDs.push(blockItem.id);
      } else if (blockItem.type === BlockType.Out) {
        this.outBlockIDs.push(blockItem.id);
      } else if (this.linkMapByFrom[blockItem.id]) {
        this.bodyBlockIDs.push(blockItem.id);
      } else {
        islandBodyBlockIDs.push(blockItem.id);
      }
    }
    this.bodyBlockIDs = islandBodyBlockIDs.concat(this.bodyBlockIDs);
  }

  buildLinkMap(links: { [id: string]: Link }): void {
    for (const [, linkItem] of Object.entries(links)) {
      this.linkMapByFrom[linkItem.from] = linkItem;
    }
  }

  updateHeader(links: { [id: string]: Link }, blocks: { [id: string]: Block }): void {
    this.buildLinkMap(links);
    this.orderBlocks(blocks);
    this.result = `\n`;
    this.result += this.indentSize;
    this.result += `def forward(self, ${this.inBlockIDs.map((id) => blocks[id].name).join(', ')}):`;
  }

  updateBody(
    blocks: { [id: string]: Block },
    graph: FromBlockCenteredGraph,
    topologicalIndice: { [idx: number]: string },
  ): void {
    // TODO: implement unifying tensor when inject multi-from-block to the next same to-block
    this.result += `\n`;

    const linkedBlockLength = Object.keys(topologicalIndice).length;
    const outputBlockName: { [blockID: string]: string[] } = {};
    const resultBlockName: string[] = [];
    for (let i = 1; i < linkedBlockLength + 1; i += 1) {
      const block = blocks[topologicalIndice[i]];
      if (block.type === BlockType.In) {
        if (graph[block.id]) {
          for (const toBlock of graph[block.id]) {
            if (!outputBlockName[toBlock]) {
              outputBlockName[toBlock] = [];
            }
            outputBlockName[toBlock].push(block.name);
          }
        }
        continue;
      }
      for (let i = 0; i < this.indentDepth + 1; i += 1) {
        this.result += this.indentSize;
      }
      if (block.type === BlockType.Out) {
        if (outputBlockName[block.id] && outputBlockName[block.id].length > 1) {
          this.result += `${block.name}_result = torch.sum(torch.stack(${outputBlockName[block.id]}), dim=0)`;
          outputBlockName[block.id] = [`${block.name}_input`];
        } else {
          this.result += `${block.name}_result = ${
            outputBlockName[block.id] ? `${outputBlockName[block.id][0]}` : ''
          }\n`;
        }
        this.result += `\n`;
        resultBlockName.push(`${block.name}_result`);
        continue;
      }
      if (outputBlockName[block.id] && outputBlockName[block.id].length > 1) {
        this.result += `${block.name}_input = torch.sum(torch.stack(${outputBlockName[block.id]}), dim=0)`;
        this.result += `\n`;
        outputBlockName[block.id] = [`${block.name}_input`];
        for (let i = 0; i < this.indentDepth + 1; i += 1) {
          this.result += this.indentSize;
        }
      }
      this.result += `${block.name}_output = self.${block.name}(${
        outputBlockName[block.id] ? `${outputBlockName[block.id][0]}` : ''
      })\n`;
      if (graph[block.id]) {
        for (const toBlock of graph[block.id]) {
          if (!outputBlockName[toBlock]) {
            outputBlockName[toBlock] = [];
          }
          outputBlockName[toBlock].push(`${block.name}_output`);
        }
      }
    }
    for (let i = 0; i < this.indentDepth + 1; i += 1) {
      this.result += this.indentSize;
    }
    this.result += `return `;
    for (const resultBlock of resultBlockName) {
      this.result += `${resultBlock}`;
    }
  }

  //   for (const inputBlock of this.inBlockIDs) {
  //     for (let i = 0; i < this.indentDepth + 1; i += 1) {
  //       this.result += this.indentSize;
  //     }
  //     const fromNode = this.linkMapByFrom[inputBlock]?.from;
  //     this.result += `${blocks[inputBlock].name}_output = self.${blocks[inputBlock].name}(${blocks[fromNode]?.name})\n`;
  //   }
  //   const returnList = [];
  //   for (const bodyBlock of this.bodyBlockIDs) {
  //     const toNode = this.linkMapByFrom[bodyBlock]?.to;
  //     const fromNode = this.linkMapByFrom[bodyBlock]?.from;
  //     if (this.outBlockIDs.includes(toNode)) {
  //       returnList.push(fromNode);
  //       continue;
  //     }
  //     for (let i = 0; i < this.indentDepth + 1; i += 1) {
  //       this.result += this.indentSize;
  //     }

  //     this.result += `${blocks[bodyBlock].name}_output = self.${blocks[bodyBlock].name}(${
  //       fromNode ? `${blocks[fromNode].name}_output` : ''
  //     })\n`;
  //   }

  //   this.result += `\n`;
  //   for (let i = 0; i < this.indentDepth + 1; i += 1) {
  //     this.result += this.indentSize;
  //   }
  //   this.result += `return `;
  //   for (const returnItem of returnList) {
  //     this.result += `${blocks[returnItem].name}_output`;
  //   }
  //   this.result += `\n`;
  // }

  getResult(): string {
    return this.result;
  }
}
