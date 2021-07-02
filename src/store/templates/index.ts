// Metis
// Copyright 2021-present NAVER Corp.
// Apache License v2.0

import { Project } from 'features/projectSlice';
import vggProject from './vggNet';
import resnetProject from './resNet';

const templateProjects: { [id: string]: Project } = {
  vggProject,
  resnetProject,
};

export default templateProjects;
