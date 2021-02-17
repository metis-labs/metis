import { Block, BlockType, EmptyModel, Link } from '../store/types';
export class ForwardConverter {
  private blocks: { [id: string]: Block };
  private bodyBlockList: string[];
  private readonly inputBlockList: string[];
  private readonly outputBlockList: string[];
  private resultInit: string;
  private readonly indentSize: string;
  private readonly indentDepth: number;
  private options: string;
  private readonly linkMapByFrom: { [fromId: string]: Link };

  constructor() {
    this.blocks = EmptyModel.blocks;
    this.bodyBlockList = [];
    this.inputBlockList = [];
    this.outputBlockList = [];
    this.resultInit = `\n\n`;
    this.indentSize = `    `;
    this.indentDepth = 1;
    this.options = '';
    this.linkMapByFrom = {};
  }

  orderedBlockList(blocks: { [id: string]: Block }): void {
    // TODO: Implement block clustering method using links
    // TODO: Employ topological sort for block ordering
    const islandBodyBlockList = [];
    for (const [, blockItem] of Object.entries(blocks)) {
      if (blockItem.type === BlockType.In) {
        this.inputBlockList.push(blockItem.id);
      } else if (blockItem.type === BlockType.Out) {
        this.outputBlockList.push(blockItem.id);
      } else if (this.linkMapByFrom[blockItem.id]) {
        this.bodyBlockList.push(blockItem.id);
      } else {
        islandBodyBlockList.push(blockItem.id);
      }
    }
    this.bodyBlockList = islandBodyBlockList.concat(this.bodyBlockList);
  }

  buildLinkMap(links: { [id: string]: Link }): void {
    for (const [, linkItem] of Object.entries(links)) {
      this.linkMapByFrom[linkItem.from] = linkItem;
    }
  }

  updateForwardFront(links: { [id: string]: Link }, blocks: { [id: string]: Block }): void {
    this.buildLinkMap(links);
    this.orderedBlockList(blocks);
    this.resultInit = `\n`;
    this.resultInit += this.indentSize;
    this.resultInit += `def forward(self, ${this.inputBlockList.map((id) => blocks[id].name).join(', ')}):`;
  }

  updateForwardBody(blocks: { [id: string]: Block }): void {
    // TODO: implement unifying tensor when inject multi-from-block to the next same to-block
    this.resultInit += `\n`;
    for (const inputBlock of this.inputBlockList) {
      for (let i = 0; i < this.indentDepth + 1; i++) {
        this.resultInit += this.indentSize;
      }
      const fromNode = this.linkMapByFrom[inputBlock]?.from;
      this.resultInit += `${blocks[inputBlock].name}_output = self.${blocks[inputBlock].name}(${blocks[fromNode]?.name})\n`;
    }
    const returnList = [];
    for (const bodyBlock of this.bodyBlockList) {
      const toNode = this.linkMapByFrom[bodyBlock]?.to;
      const fromNode = this.linkMapByFrom[bodyBlock]?.from;
      if (this.outputBlockList.includes(toNode)) {
        returnList.push(fromNode);
        continue;
      }
      for (let i = 0; i < this.indentDepth + 1; i++) {
        this.resultInit += this.indentSize;
      }

      this.resultInit += `${blocks[bodyBlock].name}_output = self.${blocks[bodyBlock].name}(${
        fromNode ? blocks[fromNode].name + '_output' : ''
      })\n`;
    }

    this.resultInit += `\n`;
    for (let i = 0; i < this.indentDepth + 1; i++) {
      this.resultInit += this.indentSize;
    }
    this.resultInit += `return `;
    for (const returnItem of returnList) {
      this.resultInit += `${blocks[returnItem].name}_output`;
    }
    this.resultInit += `\n`;
  }

  getResult(): string {
    return this.resultInit;
  }
}
