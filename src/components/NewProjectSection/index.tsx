import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

import { api } from 'api';
import { templateProjects } from 'store/templateProjects';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      height: 150,
      width: 215,
    },
    cardActionArea: {
      textAlign: 'center',
      height: '100%',
    },
    createProjectCard: {
      color: 'white',
      backgroundColor: theme.palette.primary.main,
    },
  }),
);

export default function CreateProjectSection() {
  const classes = useStyles();
  const history = useHistory();

  const handleNewProject = useCallback((templateID?: string) => {
    api.createProject('Undefined').then((res) => {
      const querystring = templateID ? `?template_id=${templateID}` : '';
      history.push(`/${res.getProject().getId()}${querystring}`);
    })
  }, [history]);

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Card className={[classes.card, classes.createProjectCard].join(' ')}>
          <CardActionArea className={classes.cardActionArea} onClick={() => handleNewProject()}>
            <CardContent>
              <AddIcon fontSize="large" />
              <Typography variant="h6" component="h6">New Project</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      {Object.values(templateProjects).map((template) => (
        <Grid key={template.id} item>
          <Card className={classes.card}>
            <CardActionArea className={classes.cardActionArea} onClick={() => handleNewProject(template.id)}>
              <CardContent><Typography variant="h6" component="h6">{template.name}</Typography></CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
      <Grid item>
        <Card className={classes.card}>
          <CardActionArea className={classes.cardActionArea}>
            <CardContent><Typography variant="h6" component="h6">Show all</Typography></CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  );
}
