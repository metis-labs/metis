import { DefaultLinkModel } from "@projectstorm/react-diagrams";

export class MetisLinkModel extends DefaultLinkModel {
  private linkID: string;

  constructor() {
    super({
      type: 'metis-link',
      width: 4,
    });
  }

  setLinkID(linkID: string): void {
    this.linkID = linkID;
  }

  getLinkID(): string {
    return this.linkID;
  }
}
