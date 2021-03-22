import React, { useState, useCallback, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import AddIcon from '@material-ui/icons/Add';

import { Project } from 'store/types';
import { templateProjects } from 'store/templateProjects';
import { ListProjectsRequest, CreateProjectRequest } from 'api/metis_pb';
import { MetisPromiseClient } from 'api/metis_grpc_web_pb';
import { fromProjects } from '../api/converter';

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
    createProjectCard: {
      height: 290,
      width: 215,
      color: 'white',
      backgroundColor: theme.palette.primary.main,
    },
    createCard: {
      textAlign: 'center',
      height: '100%',
    },
    showAllCard: {
      textAlign: 'center',
    },
    projectCard: {
      width: 290,
      height: 370,
    },
    media: {
      backgroundColor: '#ebebeb',
      height: 260,
    },
    control: {
      padding: theme.spacing(2),
    },
  }),
);

export default function ProjectIntroPage() {
  const classes = useStyles();
  const history = useHistory();
  const [projects, setProjects] = useState<Array<Project>>([]);
  const [client] = useState<MetisPromiseClient>(new MetisPromiseClient('http://localhost:8080'));

  useEffect(() => {
    client.listProjects(new ListProjectsRequest()).then((res) => {
      setProjects(fromProjects(res.getProjectsList()));
    });
  }, [client]);

  const handleNewProject = useCallback(
    (templateID?: string) => {
      const req = new CreateProjectRequest();
      req.setProjectName('Untitled');
      client.createProject(req).then((res) => {
        history.push(`/${res.getProject().getId()}?template_id=${templateID}`);
      });
    },
    [client, history],
  );

  return (
    <Container className={classes.root} maxWidth="xl">
      <Typography className={classes.sectionTitle} variant="h4" component="h4">
        Create project
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <Card className={classes.createProjectCard}>
            <CardActionArea className={classes.createCard} onClick={() => handleNewProject()}>
              <CardContent>
                <div>
                  <AddIcon fontSize="large" />
                </div>
                <Typography variant="h6" component="h6">
                  New Project
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        {Object.values(templateProjects).map((template) => (
          <Grid key={template.id} item>
            <Card className={classes.card}>
              <CardActionArea className={classes.createCard} onClick={() => handleNewProject(template.id)}>
                <CardContent className={classes.showAllCard}>{template.name}</CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
        <Grid item>
          <Card className={classes.card}>
            <CardActionArea className={classes.createCard}>
              <CardContent className={classes.showAllCard}>Show all</CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
      <Typography className={classes.sectionTitle} variant="h4" component="h4">
        Recent project
      </Typography>
      <Grid container spacing={2}>
        {projects.map((project) => (
          <Grid key={project.id} item>
            <Card className={classes.projectCard}>
              <CardMedia className={classes.media} image="/static/images/cards/contemplative-reptile.jpg" />
              <CardContent>
                <Link to={`/${project.id}`}>{project.name}</Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
