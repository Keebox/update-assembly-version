import { readFileSync } from 'fs';
import { VersionInfo } from '../src/types';
import { RESULT_FILE } from './constants';
import { readVersion } from './readVersion';

const version = readVersion();
const oldVersion = JSON.parse(
  readFileSync(RESULT_FILE, { encoding: 'utf8' })
) as VersionInfo;

if (version.tag === oldVersion.tag) {
  throw new Error(`Tag is not set, got ${version.build} tag`);
}
