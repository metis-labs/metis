import { EmptyNetworkFragment, NetworkFragment } from '../store/types';
import { ImportConverter } from './importConverter';
import { InitConverter } from './initConverter';

export class Converter {
  private previousFragment: NetworkFragment;
  private codeString: string;

  constructor() {
    this.previousFragment = EmptyNetworkFragment;
    this.codeString = '';
  }

  update(fragment: NetworkFragment): void {
    if (
      fragment.dependencies === this.previousFragment.dependencies &&
      fragment.blocks === this.previousFragment.blocks &&
      fragment.links === this.previousFragment.links
    ) {
      return;
    }

    const importTemplate = new ImportConverter();
    importTemplate.update(fragment.dependencies);

    const initTemplate = new InitConverter();
    initTemplate.updateInitFront(fragment.diagramInfo);
    initTemplate.updateInitBody(fragment.blocks);

    this.codeString += importTemplate.getResult();
    this.codeString += initTemplate.getResult();

    this.previousFragment = fragment;
  }

  getResult(): string {
    return this.codeString;
  }
}
