import { Block, BlockType, EmptyNetwork, Link } from '../store/types';

export default class ForwardConverter {
  private blocks: { [id: string]: Block };

  private bodyBlockIDs: string[];

  private readonly inBlockIDs: string[];

  private readonly outBlockIDs: string[];

  private result: string;

  private readonly indentSize: string;

  private readonly indentDepth: number;

  private options: string;

  private readonly linkMapByFrom: { [fromId: string]: Link };

  constructor() {
    this.blocks = EmptyNetwork.blocks;
    this.bodyBlockIDs = [];
    this.inBlockIDs = [];
    this.outBlockIDs = [];
    this.result = `\n\n`;
    this.indentSize = `    `;
    this.indentDepth = 1;
    this.options = '';
    this.linkMapByFrom = {};
  }

  orderedBlockList(blocks: { [id: string]: Block }): void {
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

  updateForwardFront(links: { [id: string]: Link }, blocks: { [id: string]: Block }): void {
    this.buildLinkMap(links);
    this.orderedBlockList(blocks);
    this.result = `\n`;
    this.result += this.indentSize;
    this.result += `def forward(self, ${this.inBlockIDs.map((id) => blocks[id].name).join(', ')}):`;
  }

  updateForwardBody(blocks: { [id: string]: Block }): void {
    // TODO: implement unifying tensor when inject multi-from-block to the next same to-block
    this.result += `\n`;
    for (const inputBlock of this.inBlockIDs) {
      for (let i = 0; i < this.indentDepth + 1; i+=1) {
        this.result += this.indentSize;
      }
      const fromNode = this.linkMapByFrom[inputBlock]?.from;
      this.result += `${blocks[inputBlock].name}_output = self.${blocks[inputBlock].name}(${blocks[fromNode]?.name})\n`;
    }
    const returnList = [];
    for (const bodyBlock of this.bodyBlockIDs) {
      const toNode = this.linkMapByFrom[bodyBlock]?.to;
      const fromNode = this.linkMapByFrom[bodyBlock]?.from;
      if (this.outBlockIDs.includes(toNode)) {
        returnList.push(fromNode);
        continue;
      }
      for (let i = 0; i < this.indentDepth + 1; i+=1) {
        this.result += this.indentSize;
      }

      this.result += `${blocks[bodyBlock].name}_output = self.${blocks[bodyBlock].name}(${
        fromNode ? `${blocks[fromNode].name  }_output` : ''
      })\n`;
    }

    this.result += `\n`;
    for (let i = 0; i < this.indentDepth + 1; i+=1) {
      this.result += this.indentSize;
    }
    this.result += `return `;
    for (const returnItem of returnList) {
      this.result += `${blocks[returnItem].name}_output`;
    }
    this.result += `\n`;
  }

  getResult(): string {
    return this.result;
  }
}
