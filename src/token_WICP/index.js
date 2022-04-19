import { Actor, HttpAgent } from '@dfinity/agent';

// Imports and re-exports candid interface
import { idlFactory } from './token_WICP.did.js';
import logger from 'node-color-log';
import { exec } from 'shelljs';

export { idlFactory } from './token_WICP.did.js';
// CANISTER_ID is replaced by webpack based on node environment
export const canisterId = process.env.DFT_BASIC_CANISTER_ID;
global.fetch = require('node-fetch');

/**
 *
 * @param {string | import("@dfinity/principal").Principal} canisterId Canister ID of Agent
 * @param {{agentOptions?: import("@dfinity/agent").HttpAgentOptions; actorOptions?: import("@dfinity/agent").ActorConfig}} [options]
 * @return {import("@dfinity/agent").ActorSubclass<import("./token_WICP.did.js")._SERVICE>}
 */
export const createActor = (canisterId, options) => {
  const agent = new HttpAgent({ ...options?.agentOptions });
  // Fetch root key for certificate validation during development
  if (process.env.NODE_ENV !== 'production') {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        'Unable to fetch root key. Check to ensure that your local replica is running',
      );
      console.error(err);
    });
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options?.actorOptions,
  });
};

export const createLocalActorByName = (name) => {
  const canisterId = get_id(name);
  return createActor(name, {
    agentOptions: { host: 'http://127.0.0.1:8000' },
  });
};
export const createLocalActor = (canisterId) => {
  return createActor(canisterId, {
    agentOptions: { host: 'http://127.0.0.1:8000' },
  });
};

export const num_blocks_to_archive = 1000;

export const get_id = (name) => {
  return exec(`dfx canister id ${name}`, { silent: true }).stdout.trim();
};
