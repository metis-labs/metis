import * as grpcWeb from 'grpc-web';

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';

import {
  CreateModelRequest,
  CreateModelResponse,
  CreateProjectRequest,
  CreateProjectResponse,
  ListProjectsRequest,
  ListProjectsResponse} from './metis_pb';

export class MetisClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  createModel(
    request: CreateModelRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: CreateModelResponse) => void
  ): grpcWeb.ClientReadableStream<CreateModelResponse>;

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

}

export class MetisPromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  createModel(
    request: CreateModelRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<CreateModelResponse>;

  createProject(
    request: CreateProjectRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<CreateProjectResponse>;

  listProjects(
    request: ListProjectsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<ListProjectsResponse>;

}

