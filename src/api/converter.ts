import { Project } from 'store/types';
import { Project as PbProject } from './metis_pb';

export function fromProjects(pbProjects: Array<PbProject>): Array<Project> {
  const projects = [];
  for (const pbProject of pbProjects) {
    projects.push(fromProject(pbProject));
  }
  return projects;
}

export function fromProject(pbProject: PbProject): Project {
  return {
    id: pbProject.getId(),
    name: pbProject.getName(),
    models: {},
  } as Project;
}
