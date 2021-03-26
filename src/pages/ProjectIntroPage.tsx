import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

import NavBar from 'components/NavBar';
import ProjectCard from 'components/ProjectCard';
import NewProjectSection from 'components/NewProjectSection';

import { ListProjectsRequest } from 'api/metis_pb';
import { MetisPromiseClient } from 'api/metis_grpc_web_pb';
import { fromProjects } from 'api/converter';
import { useAppState } from 'index';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: 50,
    },
    sectionTitle: {
      margin: '25px 0',
    },
    card: {
      height: 290,
      width: 215,
    },
    createCard: {
      textAlign: 'center',
      height: '100%',
    },
    createProjectCard: {
      height: 290,
      width: 215,
      color: 'white',
      backgroundColor: theme.palette.primary.main,
    },
    showAllCard: {
      textAlign: 'center',
    },
    cardTitle: {
      width: 200,
      textOverflow: 'ellipsis',
    },
    control: {
      padding: theme.spacing(2),
    },
  }),
);

export default function ProjectIntroPage() {
  const classes = useStyles();
  const [appState, updateAppState] = useAppState();
  const [client] = useState<MetisPromiseClient>(new MetisPromiseClient('http://localhost:8080'));

  useEffect(() => {
    client.listProjects(new ListProjectsRequest()).then((res) => {
      updateAppState((appState) => {
        appState.local.projectInfos = fromProjects(res.getProjectsList());
        return appState;
      });
    });
  }, [updateAppState, client]);

  return (
    <div>
      <NavBar />
      <Container className={classes.root} maxWidth="xl">
        <Typography className={classes.sectionTitle} variant="h5" component="h5">Create a project</Typography>
        <NewProjectSection />
        <Typography className={classes.sectionTitle} variant="h5" component="h5">
          All projects
        </Typography>
        <Grid container spacing={2}>
          {Object.values(appState.local.projectInfos).map((project) => (
            <Grid key={project.id} item>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
