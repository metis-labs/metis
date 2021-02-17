import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Project } from 'store/types';
import { ListProjectsRequest } from 'api/metis_pb';
import { MetisPromiseClient } from 'api/metis_grpc_web_pb';
import { fromProjects } from '../api/converter';

export default function ProjectIntroPage() {
  const [projects, setProjects] = useState<Array<Project>>([]);

  useEffect(() => {
    const client = new MetisPromiseClient('http://localhost:8080');
    client.listProjects(new ListProjectsRequest()).then((res) => {
      setProjects(fromProjects(res.getProjectsList()));
    });
  }, []);

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>
          <Link to={`/${project.id}`}>{project.name}</Link>
        </li>
      ))}
    </ul>
  );
}
