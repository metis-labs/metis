import { Block, BlockType, DiagramInfo, EmptyNetworkFragment } from '../store/types';
import metadata from './pytorch-metadata.json';

export class InitConverter {
  private blocks: { [id: string]: Block };
  private readonly bodyBlockList: string[];
  private readonly inputBlockList: string[];
  private readonly outputBlockList: string[];
  private resultInit: string;
  private readonly indentSize: string;
  private readonly indentDepth: number;
  private options: string;

  constructor() {
    this.blocks = EmptyNetworkFragment.blocks;
    this.bodyBlockList = [];
    this.inputBlockList = [];
    this.outputBlockList = [];
    this.resultInit = `\n\n`;
    this.indentSize = `    `;
    this.indentDepth = 1;
    this.options = '';
  }

  orderedBlockList(blocks: { [id: string]: Block }): void {
    for (const [, blockItem] of Object.entries(blocks)) {
      if (blockItem.type === BlockType.In) {
        this.inputBlockList.push(blockItem.id);
      } else if (blockItem.type === BlockType.Out) {
        this.outputBlockList.push(blockItem.id);
      } else {
        this.bodyBlockList.push(blockItem.id);
      }
    }
  }

  updateInitFront(diagramInfo: DiagramInfo): void {
    this.resultInit = `\n\n`;
    this.resultInit += `class ${diagramInfo.name}(torch.nn.Module):\n`;
    this.resultInit += this.indentSize;
    this.resultInit += `def __init__(self):\n`;
    for (let i = 0; i < this.indentDepth + 1; i++) {
      this.resultInit += this.indentSize;
    }
    this.resultInit += `super(${diagramInfo.name}, self).__init__()\n`;
  }

  updateInitBody(blocks: { [id: string]: Block }): void {
    this.orderedBlockList(blocks);
    this.resultInit += `\n`;
    for (const blockId of this.bodyBlockList) {
      for (let i = 0; i < this.indentDepth + 1; i++) {
        this.resultInit += this.indentSize;
      }
      this.resultInit += `self.${blocks[blockId].name} = nn.${blocks[blockId].type} \n`;
      this.updateOption(blocks[blockId]);
    }
  }

  updateOption(block: Block): void {
    const idx = metadata.findIndex((data) => data.abbrev === block.type);
    this.options = metadata[idx].name;
    console.log(this.options);
  }

  getResult(): string {
    return this.resultInit;
  }
}
