import { v4 as uuidv4 } from 'uuid';
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
  in: {
    id: 'in',
    name: 'in',
    type: BlockType.In,
    position: { x: 100, y: 100 },
  },
  out: {
    id: 'out',
    name: 'out',
    type: BlockType.Out,
    position: { x: 100, y: 200 },
  },
};

const links: { [id: string]: Link } = {};

const initialModel = {
  id: 'model',
  name: 'model',
  type: DiagramType.Main,
  diagramInfo: {},
  dependencies,
  blocks,
  links,
} as Model;

export function createModel(name: string) {
  return {
    id: uuidv4(),
    name,
    type: DiagramType.Main,
    diagramInfo: {},
    dependencies,
    blocks,
    links,
  };
}

const initialProject: Project = {
  id: 'initial',
  name: 'untitled',
  models: {
    model: initialModel,
  },
};

export default initialProject;
