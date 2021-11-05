import { readFileSync } from 'fs';
import { VersionInfo } from '../src/types';
import { RESULT_FILE } from './constants';
import { readVersion } from './readVersion';

const version = readVersion();
const oldVersion = JSON.parse(
  readFileSync(RESULT_FILE, { encoding: 'utf8' })
) as VersionInfo;

if (
  typeof version.build !== 'number' ||
  version.build - 1 !== oldVersion.build
) {
  throw new Error(`Invalid build ${version.build}`);
}
