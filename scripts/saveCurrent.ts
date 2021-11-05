import { writeFileSync } from 'fs';
import { RESULT_FILE } from './constants';
import { readVersion } from './readVersion';

const versionInfo = readVersion();

writeFileSync(RESULT_FILE, JSON.stringify(versionInfo));
