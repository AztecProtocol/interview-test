import { pathExists, readJson, writeJson } from 'fs-extra';

export interface ServerState {}

/**
 * Can be used to save and restore general server state.
 */
export interface ServerStateDb {
  readState(): Promise<ServerState>;
  writeState(state: ServerState): Promise<void>;
}
