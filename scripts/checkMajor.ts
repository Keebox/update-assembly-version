import { readFileSync } from 'fs';
import { VersionInfo } from '../src/types';
import { RESULT_FILE } from './constants';
import { readVersion } from './readVersion';

const version = readVersion();
const oldVersion = JSON.parse(
  readFileSync(RESULT_FILE, { encoding: 'utf8' })
) as VersionInfo;

if (version.major - 1 !== oldVersion.major) {
  throw new Error(`Invalid major ${version.build}`);
}

if (version.minor !== 0) {
  throw new Error('Minor is not 0');
}
