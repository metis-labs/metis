import React from 'react';
import anonymous from 'anonymous-animals-gen';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Tooltip from '@material-ui/core/Tooltip';

import { useAppState } from 'index';

export default function PeerGroup() {
  const [appState, ] = useAppState();

  return (
    <AvatarGroup max={4}>
      {
        Object.entries(appState.peers).map(([peerID, peer]) =>
          <Tooltip key={peerID} title={peer.username} data-id={peerID} arrow>
            <Avatar
              key={peerID}
              alt="Peer Image"
              style={{ backgroundColor: peer.color }}
              src={anonymous.getImage(peer.image)}
            />
          </Tooltip>
        )
      }
    </AvatarGroup>
  );
}