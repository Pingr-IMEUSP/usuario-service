import { Message } from 'node-nats-streaming';
import User, { UserInterface } from '../db/mockdb';

import { stan } from './stan';

export function setupListeners(): void {
  const replayAllOpts = stan.subscriptionOptions().setDeliverAllAvailable();

  const createdUser = stan.subscribe('USER_CREATED', replayAllOpts);

  createdUser.on(
    'message',
    async (msg : Message): Promise<void> => {
      const user:UserInterface = JSON.parse(msg.getData() as string);

      console.log('[USER_CREATED]:', user);
      User.all.push(user);
    }
  )
}