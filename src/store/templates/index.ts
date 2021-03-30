import { Project } from 'store/types';

import vggProject from './vggNet';
import resnetProject from './resNet';

const templateProjects: { [id: string]: Project } = {
  vggProject,
  resnetProject,
};

export default templateProjects;
