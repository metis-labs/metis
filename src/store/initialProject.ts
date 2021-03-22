import { Block, BlockType, Dependency, DiagramType, Link, Model, Project } from './types';

const dependencies: { [id: string]: Dependency } = {
  torch: {
    id: 'torch',
    name: 'torch',
  },
  torchNN: {
    id: 'torchNN',
    name: 'torch.nn',
    alias: 'nn',
  },
};

const blocks: { [id: string]: Block } = {
  vgg_in: {
    id: 'vgg_in',
    name: 'vgg_in',
    type: BlockType.In,
    position: { x: 100, y: 100 },
  },
  vgg_out: {
    id: 'vgg_out',
    name: 'vgg_out',
    type: BlockType.Out,
    position: { x: 100, y: 200 },
  },
};

const links: { [id: string]: Link } = {};

const model = {
  id: 'model',
  name: 'model',
  type: DiagramType.Main,
  diagramInfo: {},
  dependencies,
  blocks,
  links,
} as Model;

export const initialProject: Project = {
  id: 'initial',
  name: 'untitled',
  models: {
    model: model,
  },
};
