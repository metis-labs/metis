import { Project } from 'features/projectSlice';
import { Dependency, Link } from 'store/types/networks';
import { Block, BlockType } from 'store/types/blocks';

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
    initVariables: '',
  },
  vgg_out: {
    id: 'vgg_out',
    name: 'vgg_out',
    type: BlockType.Out,
    position: { x: 100, y: 600 },
    initVariables: '',
  },
  conv_1: {
    id: 'conv_1',
    name: 'conv_1',
    type: BlockType.Conv2d,
    position: { x: 100, y: 200 },
    repeats: 1,
    parameters: {
      inChannels: 3,
      outChannels: 64,
      kernelSize: 3,
      stride: 1,
      padding: 1,
      paddingMode: 'zeros', // categorical
      dilation: 1,
      groups: 1,
      bias: true, // boolean
    },
  },
  batchnorm_1: {
    id: 'batchnorm_1',
    name: 'batchnorm_1',
    type: BlockType.BatchNorm2d,
    position: { x: 100, y: 300 },
    repeats: 1,
    parameters: {
      numFeatures: 64,
      eps: 1e-5,
      momentum: 0.1,
      affine: true,
      track_running_stats: 1,
    },
  },
  relu_1: {
    id: 'relu_1',
    name: 'relu_1',
    type: BlockType.ReLU,
    position: { x: 100, y: 400 },
    repeats: 1,
    parameters: {
      inplace: false, // boolean
    },
  },
  maxpool_1: {
    id: 'maxpool_1',
    name: 'maxpool_1',
    type: BlockType.MaxPool2d,
    position: { x: 100, y: 500 },
    repeats: 1,
    parameters: {
      kernelSize: 2,
      stride: 1,
      padding: 1,
      dilation: 1,
      returnIndices: false,
      ceilMode: false,
    },
  },
};

const links: { [id: string]: Link } = {
  link1: {
    id: 'link1',
    from: 'vgg_in',
    to: 'conv_1',
  },
  link2: {
    id: 'link2',
    from: 'conv_1',
    to: 'batchnorm_1',
  },
  link3: {
    id: 'link3',
    from: 'batchnorm_1',
    to: 'relu_1',
  },
  link4: {
    id: 'link4',
    from: 'relu_1',
    to: 'maxpool_1',
  },
  link5: {
    id: 'link5',
    from: 'maxpool_1',
    to: 'vgg_out',
  },
};

const vggProject: Project = {
  id: 'vggProject',
  name: 'VGGNet',
  networks: {
    vgg_16: {
      id: 'vgg_16',
      name: 'vgg_16',
      dependencies,
      blocks,
      links,
    },
  },
};

export default vggProject;
