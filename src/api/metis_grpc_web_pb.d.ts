import * as grpcWeb from 'grpc-web';

import {
  CreateProjectRequest,
  CreateProjectResponse,
  DeleteProjectRequest,
  DeleteProjectResponse,
  ListProjectsRequest,
  ListProjectsResponse,
  UpdateProjectRequest,
  UpdateProjectResponse} from './metis_pb';

export class MetisClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  createProject(
    request: CreateProjectRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: CreateProjectResponse) => void
  ): grpcWeb.ClientReadableStream<CreateProjectResponse>;

  listProjects(
    request: ListProjectsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: ListProjectsResponse) => void
  ): grpcWeb.ClientReadableStream<ListProjectsResponse>;

  updateProject(
    request: UpdateProjectRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: UpdateProjectResponse) => void
  ): grpcWeb.ClientReadableStream<UpdateProjectResponse>;

  deleteProject(
    request: DeleteProjectRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: DeleteProjectResponse) => void
  ): grpcWeb.ClientReadableStream<DeleteProjectResponse>;

}

export class MetisPromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  createProject(
    request: CreateProjectRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<CreateProjectResponse>;

  listProjects(
    request: ListProjectsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<ListProjectsResponse>;

  updateProject(
    request: UpdateProjectRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<UpdateProjectResponse>;

  deleteProject(
    request: DeleteProjectRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<DeleteProjectResponse>;

}

