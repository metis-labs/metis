// Metis
// Copyright 2021-present NAVER Corp.
// Apache License v2.0

import { ProjectInfo } from 'features/projectInfosSlice';
import { Project as PbProject } from './metis_pb';

export function fromProject(pbProject: PbProject): ProjectInfo {
  return {
    id: pbProject.getId(),
    name: pbProject.getName(),
    createdAt: pbProject.getCreatedAt().toDate(),
  };
}

export function fromProjects(pbProjects: Array<PbProject>): { [projectID: string]: ProjectInfo } {
  const projects = {};
  for (const pbProject of pbProjects) {
    projects[pbProject.getId()] = fromProject(pbProject);
  }
  return projects;
}
