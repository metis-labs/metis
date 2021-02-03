import { EmptyNetworkFragment, NetworkFragment } from '../store/types';
import { ImportConverter } from './importConverter';
import { InitConverter } from './initConverter';
import { ForwardConverter } from './forwardConverter';

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

    this.codeString = '';

    const importTemplate = new ImportConverter();
    importTemplate.update(fragment.dependencies);

    const initTemplate = new InitConverter();
    initTemplate.updateInitFront(fragment.diagramInfo);
    initTemplate.updateInitBody(fragment.blocks);

    const forwardTemplate = new ForwardConverter();
    forwardTemplate.updateForwardFront(fragment.links, fragment.blocks);
    forwardTemplate.updateForwardBody(fragment.blocks);

    this.codeString += importTemplate.getResult();
    this.codeString += initTemplate.getResult();
    this.codeString += forwardTemplate.getResult();

    this.previousFragment = fragment;
  }

  getResult(): string {
    return this.codeString;
  }
}
