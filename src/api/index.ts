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

const client = new MetisPromiseClient(`${process.env.REACT_APP_METIS_RPC_ADDR}`);

const api = {
  createProject(name: string): Promise<CreateProjectResponse> {
    const req = new CreateProjectRequest();
    req.setProjectName(name);
    return client.createProject(req);
  },
  listProjects(): Promise<ListProjectsResponse> {
    const req = new ListProjectsRequest();
    return client.listProjects(req);
  },
  updateProject(id: string, name: string): Promise<UpdateProjectResponse> {
    const req = new UpdateProjectRequest();
    req.setProjectId(id);
    req.setProjectName(name);
    return client.updateProject(req);
  },
  deleteProject(id: string): Promise<DeleteProjectResponse> {
    const req = new DeleteProjectRequest();
    req.setProjectId(id);
    return client.deleteProject(req);
  },
};

export default api;
