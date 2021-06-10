import React from 'react';
import { useSelector } from 'react-redux';
import anonymous from 'anonymous-animals-gen';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Tooltip from '@material-ui/core/Tooltip';

import { AppState } from 'app/rootReducer';

export default function PeerGroup() {
  const peersState = useSelector((state: AppState) => state.peerState.peers);
  const client = useSelector((state: AppState) => state.docState.client);
  if (!client) {
    return null;
  }

  const onlinePeersState = Object.values(peersState).filter((peer) => peer.status === 'connected');
  const myClientID = client.getID();

  return (
    <AvatarGroup max={4}>
      {onlinePeersState.map((peer) => (
        <Tooltip key={peer.id} title={peer.username} data-id={peer.id} arrow>
          <Avatar
            key={peer.id}
            alt="Peer Image"
            style={{
              backgroundColor: peer.color,
              border: peer.id === myClientID ? '2px solid black' : '',
            }}
            src={anonymous.getImage(peer.image)}
          />
        </Tooltip>
      ))}
    </AvatarGroup>
  );
}
