export enum BlockType {
  In = "In",
  Out = "Out",
  Conv2d = "Conv2d",
  ReLU = "ReLU",
  MaxPool2d = "MaxPool2d",
}

export interface Position {
  x: number;
  y: number;
}

export type Property = string | number | boolean;

export type Properties = {[key: string]: Property};

export class Block {
  private readonly id: string;
  private readonly name: string;
  private type: BlockType;
  private readonly position: Position;
  private readonly properties: Properties;

  constructor(
    id: string,
    name: string,
    type: BlockType,
    position: Position,
    properties?: Properties,
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.position = position;
    this.properties = properties || {};
  }

  public getID(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getType(): BlockType {
    return this.type;
  }

  public getPosition(): Position {
    return this.position;
  }

  public getProperties(): Properties {
    return this.properties;
  }

  public getProperty(key: string): Property | undefined {
    return this.properties[ key ];
  }

  public setType(type: BlockType): void {
    this.type = type;
  }

  public setPosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
  }
}

export interface Link {
  from: string;
  to: string;
}

export class NetworkFragment {
  private readonly blocks: Array<Block>;
  private readonly links: Array<Link>;

  constructor() {
    this.blocks = [];
    this.links = [];
  }

  public addBlock(block: Block) {
    this.blocks.push(block);
  }

  public addLink(link: Link) {
    this.links.push(link);
  }

  public getBlocks(): Array<Block> {
    return this.blocks;
  }

  public getBlock(id: string): Block | undefined {
    for (const block of this.blocks) {
      if (block.getID() === id) {
        return block;
      }
    }
    return;
  }

  public getLinks(): Array<Link> {
    return this.links;
  }
}
