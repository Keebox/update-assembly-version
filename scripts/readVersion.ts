import { readFileSync } from 'fs';
import { VersionInfo } from '../src/types';
import { findAssemblyVersion, parseVersion } from '../src/utils';
import { ASSEMBLY_FILE } from './constants';

export function readVersion(): VersionInfo {
  const file = readFileSync(ASSEMBLY_FILE, { encoding: 'utf8' });

  const version = findAssemblyVersion(file);
  return parseVersion(version);
}
