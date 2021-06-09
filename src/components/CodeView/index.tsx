import React, { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import Converter from 'converter';
import { useSelector } from 'react-redux';
import { AppState } from 'app/rootReducer';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      marginTop: '64px',
      paddingTop: '30px',
      height: 'calc(100vh - 64px)',
      backgroundColor: '#f8f8ff',
    },
  }),
);

export default function CodeView() {
  const classes = useStyles();
  const client = useSelector((state: AppState) => state.docState.client);
  const peers = useSelector((state: AppState) => state.peerState.peers);
  const selectedNetworkID = peers[client.getID()].selectedNetworkID;
  const [converter] = useState(new Converter());
  const [codeString, setCodeString] = useState('');
  const project = useSelector((state: AppState) => state.projectState.project);

  useEffect(() => {
    converter.update(project, selectedNetworkID);
    setCodeString(converter.getResult());
  }, [setCodeString, selectedNetworkID, project]);

  return (
    <div className={classes.root}>
      <SyntaxHighlighter language="python" style={docco} showLineNumbers>
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}
