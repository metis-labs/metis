import React, { useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

import NavBar from 'components/NavBar';
import ProjectCard from 'components/ProjectCard';
import NewProjectSection from 'components/NewProjectSection';

import api from 'api';
import { fromProjects } from 'api/converter';
import useAppState from 'index';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      marginTop: 130,
      position: 'relative',
      flexGrow: 1,
      height: '100vh',
    },
    sectionTitle: {
      margin: '25px 0',
    },
  }),
);

export default function ProjectIntroPage() {
  const classes = useStyles();
  const [appState, updateAppState] = useAppState();

  useEffect(() => {
    api.listProjects().then((res) => {
      updateAppState((appState) => {
        appState.local.projectInfos = fromProjects(res.getProjectsList());
        return appState;
      });
    });
  }, [updateAppState]);

  return (
    <div className={classes.root}>
      <NavBar />
      <Container className={classes.content}>
        <Typography className={classes.sectionTitle} variant="h5" component="h5">
          Create a project
        </Typography>
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
