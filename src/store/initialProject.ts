import { v4 as uuidv4 } from 'uuid';
import { Project } from './types';
import { Link, Network, Dependency } from './types/networks';
import { Block, BlockType } from './types/blocks';

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
    initVariables: '',
  },
  out: {
    id: 'out',
    name: 'out',
    type: BlockType.Out,
    position: { x: 100, y: 200 },
    initVariables: '',
  },
};

const links: { [id: string]: Link } = {};

const initialNetwork = {
  id: 'network',
  name: 'network',
  diagramInfo: {},
  dependencies,
  blocks,
  links,
} as Network;

export function createNetwork(name: string) {
  return {
    id: uuidv4(),
    name,
    diagramInfo: {},
    dependencies,
    blocks,
    links,
  };
}

const initialProject: Project = {
  id: 'initial',
  name: 'untitled',
  networks: {
    network: initialNetwork,
  },
};

export default initialProject;
