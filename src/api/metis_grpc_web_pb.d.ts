import * as grpcWeb from 'grpc-web';

import * as src_api_metis_pb from '../../src/api/metis_pb';

export class MetisClient {
  constructor(
    hostname: string,
    credentials?: null | { [index: string]: string },
    options?: null | { [index: string]: any },
  );

  createModel(
    request: src_api_metis_pb.CreateModelRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error, response: src_api_metis_pb.CreateModelResponse) => void,
  ): grpcWeb.ClientReadableStream<src_api_metis_pb.CreateModelResponse>;

  listProjects(
    request: src_api_metis_pb.ListProjectsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error, response: src_api_metis_pb.ListProjectsResponse) => void,
  ): grpcWeb.ClientReadableStream<src_api_metis_pb.ListProjectsResponse>;
}

export class MetisPromiseClient {
  constructor(
    hostname: string,
    credentials?: null | { [index: string]: string },
    options?: null | { [index: string]: any },
  );

  createModel(
    request: src_api_metis_pb.CreateModelRequest,
    metadata?: grpcWeb.Metadata,
  ): Promise<src_api_metis_pb.CreateModelResponse>;

  listProjects(
    request: src_api_metis_pb.ListProjectsRequest,
    metadata?: grpcWeb.Metadata,
  ): Promise<src_api_metis_pb.ListProjectsResponse>;
}
