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

export type Properties = {[key: string]: string | number | boolean};

export class Block {
  private readonly id: string;
  private readonly name: string;
  private readonly type: BlockType;
  private readonly position: Position;
  private readonly properties?: Properties;

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
    this.properties = properties;
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

  public getProperties(): Properties | undefined {
    return this.properties;
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

  public getLinks(): Array<Link> {
    return this.links;
  }
}
