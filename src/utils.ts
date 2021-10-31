import { VersionInfo } from './types';

const assemblyVersionRegExp =
  /AssemblyVersion\s*\(\s*"(?<version>\d+\.\d+(-\w+)?)"\s*\)/;
const buildVersionRegExp = /^(?<release>\d+\.)(?<build>\d+)(-(?<tag>\w+))?$/;

export function findAssemblyVersion(input: string): string {
  const groups = input.match(assemblyVersionRegExp)?.groups;
  if (!groups) {
    throw new Error('Cannot find AssemblyVersion');
  }
  return groups['version'];
}

export function parseVersion(version: string): VersionInfo {
  const groups = version.match(buildVersionRegExp)?.groups;
  if (!groups) {
    throw new Error('Cannot parse version');
  }
  return {
    release: parseInt(groups['release']),
    build: parseInt(groups['build']),
    tag: groups['tag'] ?? undefined,
  };
}

export function buildVersionString(versionInfo: VersionInfo): string {
  let result = `${versionInfo.release}.${versionInfo.build}`;
  if (versionInfo.tag) {
    result += `-${versionInfo.tag}`;
  }
  return result;
}

export function replaceVersion(input: string, version: string): string {
  return input.replace(assemblyVersionRegExp, `AssemblyVersion("${version}")`);
}
