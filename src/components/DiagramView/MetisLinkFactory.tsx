import { DefaultLinkFactory } from "@projectstorm/react-diagrams";
import { GenerateModelEvent } from '@projectstorm/react-canvas-core/src/core/AbstractModelFactory';

import { MetisLinkModel, MetisLinkModelOptions } from "./MetisLinkModel";

export class MetisLinkFactory extends DefaultLinkFactory {
  constructor() {
    super('metis-link');
  }

  generateModel(): MetisLinkModel {
    return new MetisLinkModel();
  }
}
