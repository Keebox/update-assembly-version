import { getInput, setFailed, getBooleanInput } from '@actions/core';
import { readFileSync, writeFileSync } from 'fs';
import {
  buildVersionString,
  findAssemblyVersion,
  parseVersion,
  replaceVersion,
} from './utils';

try {
  const assemblyFile = getInput('assembly-file', {
    trimWhitespace: true,
    required: true,
  });
  const increaseBuild = getBooleanInput('increase-build', {
    trimWhitespace: true,
  });
  const increaseRelease = getBooleanInput('increase-release', {
    trimWhitespace: true,
  });
  const tag = getInput('tag', {
    trimWhitespace: true,
  });

  const file = readFileSync(assemblyFile, { encoding: 'utf8' });
  const version = findAssemblyVersion(file);
  const versionInfo = parseVersion(version);
  if (increaseBuild) {
    versionInfo.build += 1;
    versionInfo.tag = undefined;
  }
  if (increaseRelease) {
    versionInfo.release += 1;
    versionInfo.build = 0;
    versionInfo.tag = undefined;
  }
  if (tag) {
    versionInfo.tag = tag;
  }
  const newVersion = buildVersionString(versionInfo);
  const newFile = replaceVersion(file, newVersion);
  writeFileSync(assemblyFile, newFile);
} catch (error) {
  setFailed(error as Error);
}
