import { readFileSync } from 'fs';
import { VersionInfo } from '../src/types';
import { RESULT_FILE } from './constants';
import { readVersion } from './readVersion';

const version = readVersion();
const oldVersion = JSON.parse(
  readFileSync(RESULT_FILE, { encoding: 'utf8' })
) as VersionInfo;

if (version.minor - 1 !== oldVersion.minor) {
  throw new Error(`Invalid minor ${version.build}`);
}
if (version.build !== undefined) {
  throw new Error('Build is not undefined');
}
