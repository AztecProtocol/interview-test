import { pathExists, readJson, writeJson } from 'fs-extra';

/**
 * Any data that needs to be persisted between server restarts can be held here.
 */
export interface ServerState {}

/**
 * Implementations of the following interface can be used to save/restore ServerState.
 */
export interface ServerStateDb {
  readState(): Promise<ServerState>;
  writeState(state: ServerState): Promise<void>;
}
