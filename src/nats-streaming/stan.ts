import { connect } from 'node-nats-streaming';

const clusterID = process.env.CLUSTER_ID || 'broker';
const clusterClientID = process.env.CLUSTER_CLIENT_ID || 'usuario';
const clusterURL = process.env.CLUSTER_URL || 'nats://broker:4222';

export const stan = connect(clusterID, clusterClientID, {
  url: clusterURL,
});
