import { MetisPromiseClient } from 'api/metis_grpc_web_pb';
import {
  ListProjectsRequest,
  ListProjectsResponse,
  CreateProjectRequest,
  CreateProjectResponse,
  UpdateProjectRequest,
  UpdateProjectResponse,
  DeleteProjectRequest,
  DeleteProjectResponse,
} from 'api/metis_pb';

const client = new MetisPromiseClient('http://localhost:8080');

export const api = {
  createProject: function (name: string): Promise<CreateProjectResponse> {
    const req = new CreateProjectRequest();
    req.setProjectName(name);
    return client.createProject(req);
  },
  listProjects: function (): Promise<ListProjectsResponse> {
    const req = new ListProjectsRequest();
    return client.listProjects(req);
  },
  updateProject: function (id: string, name: string): Promise<UpdateProjectResponse> {
    const req = new UpdateProjectRequest();
    req.setProjectId(id);
    req.setProjectName(name);
    return client.updateProject(req);
  },
  deleteProject: function (id: string): Promise<DeleteProjectResponse> {
    const req = new DeleteProjectRequest();
    req.setProjectId(id);
    return client.deleteProject(req);
  },
};
