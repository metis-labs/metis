import { Block, BlockType, Dependency, DiagramInfo, DiagramType, Link, NetworkFragment, Project } from './types';

const diagramInfo: DiagramInfo = {
  id: 'test',
  name: 'test',
  type: DiagramType.Main,
};

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
  test_input: {
    id: 'test_input',
    name: 'test_input',
    type: BlockType.In,
    position: { x: 100, y: 100 },
  },
  test_output: {
    id: 'test_output',
    name: 'test_output',
    type: BlockType.Out,
    position: { x: 100, y: 500 },
  },
  conv_1: {
    id: 'conv_1',
    name: 'conv_1',
    type: BlockType.Conv2d,
    position: { x: 100, y: 200 },
    properties: {
      repeats: 1,
      inChannels: 3,
      outChannels: 1,
      kernelSize: 3,
      stride: 1,
      padding: 0,
      paddingMode: 'zeros', // categorical
      dilation: 1,
      groups: 1,
      bias: false, // boolean
    },
  },
  maxpool_1: {
    id: 'maxpool_1',
    name: 'maxpool_1',
    type: BlockType.MaxPool2d,
    position: { x: 100, y: 300 },
    properties: {
      repeats: 1,
      kernelSize: 3,
      stride: 2,
      padding: 0,
      dilation: 1,
      returnIndices: false,
      ceilMode: false,
    },
  },
  relu: {
    id: 'relu',
    name: 'relu',
    type: BlockType.ReLU,
    position: { x: 100, y: 400 },
    properties: {
      repeats: 1,
      inplace: false, // boolean
    },
  },
};

const links: { [id: string]: Link } = {
  link1: {
    id: 'link1',
    from: 'test_input',
    to: 'conv_1',
  },
  link2: {
    id: 'link2',
    from: 'conv_1',
    to: 'maxpool_1',
  },
  link3: {
    id: 'link3',
    from: 'maxpool_1',
    to: 'relu',
  },
  link4: {
    id: 'link4',
    from: 'relu',
    to: 'test_output',
  },
};

const testFragment = {
  diagramInfo,
  dependencies,
  blocks,
  links,
} as NetworkFragment;

const testFragment2 = {
  diagramInfo: {
    id: 'test2',
    name: 'test2',
    type: DiagramType.Module,
  },
  dependencies,
  blocks: {},
  links: {},
};

const testProject: Project = {
  id: 'testProject',
  name: 'testProject',
  fragments: {
    test: testFragment,
    test2: testFragment2,
  },
  selectedFragmentId: 'test',
};

export default testProject;
