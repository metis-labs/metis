import { EmptyModel, Model } from '../store/types';
import { ImportConverter } from './importConverter';
import { InitConverter } from './initConverter';
import { ForwardConverter } from './forwardConverter';

export class Converter {
  private previousModel: Model;
  private codeString: string;

  constructor() {
    this.previousModel = EmptyModel;
    this.codeString = '';
  }

  update(model: Model): void {
    if (
      model.dependencies === this.previousModel.dependencies &&
      model.blocks === this.previousModel.blocks &&
      model.links === this.previousModel.links
    ) {
      return;
    }

    this.codeString = '';

    const importTemplate = new ImportConverter();
    importTemplate.update(model.dependencies);

    const initTemplate = new InitConverter();
    initTemplate.updateInitFront(model);
    initTemplate.updateInitBody(model.blocks);

    const forwardTemplate = new ForwardConverter();
    forwardTemplate.updateForwardFront(model.links, model.blocks);
    forwardTemplate.updateForwardBody(model.blocks);

    this.codeString += importTemplate.getResult();
    this.codeString += initTemplate.getResult();
    this.codeString += forwardTemplate.getResult();

    this.previousModel = model;
  }

  getResult(): string {
    return this.codeString;
  }
}
