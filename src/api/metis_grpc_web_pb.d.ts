import * as grpcWeb from 'grpc-web';

import * as src_api_metis_pb from '../../src/api/metis_pb';


export class MetisClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  createProject(
    request: src_api_metis_pb.CreateProjectRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: src_api_metis_pb.CreateProjectResponse) => void
  ): grpcWeb.ClientReadableStream<src_api_metis_pb.CreateProjectResponse>;

  listProjects(
    request: src_api_metis_pb.ListProjectsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: src_api_metis_pb.ListProjectsResponse) => void
  ): grpcWeb.ClientReadableStream<src_api_metis_pb.ListProjectsResponse>;

  updateProject(
    request: src_api_metis_pb.UpdateProjectRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: src_api_metis_pb.UpdateProjectResponse) => void
  ): grpcWeb.ClientReadableStream<src_api_metis_pb.UpdateProjectResponse>;

  deleteProject(
    request: src_api_metis_pb.DeleteProjectRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: src_api_metis_pb.DeleteProjectResponse) => void
  ): grpcWeb.ClientReadableStream<src_api_metis_pb.DeleteProjectResponse>;

}

export class MetisPromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  createProject(
    request: src_api_metis_pb.CreateProjectRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<src_api_metis_pb.CreateProjectResponse>;

  listProjects(
    request: src_api_metis_pb.ListProjectsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<src_api_metis_pb.ListProjectsResponse>;

  updateProject(
    request: src_api_metis_pb.UpdateProjectRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<src_api_metis_pb.UpdateProjectResponse>;

  deleteProject(
    request: src_api_metis_pb.DeleteProjectRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<src_api_metis_pb.DeleteProjectResponse>;

}

