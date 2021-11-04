import { getInput } from '@actions/core';
import { VersionInfo } from './types';

const assemblyVersionRegExp =
  /AssemblyVersion\s*\(\s*"(?<version>\d+\.\d+(\.\d+)?(-\w+)?)"\s*\)/;
const buildVersionRegExp =
  /^(?<major>\d+\.)(?<minor>\d+)(\.(?<build>\d+))?(-(?<tag>\w+))?$/;

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
    major: parseInt(groups['major']),
    minor: parseInt(groups['minor']),
    build:
      groups['build'] !== undefined ? parseInt(groups['build']) : undefined,
    tag: groups['tag'] ?? undefined,
  };
}

export function buildVersionString(versionInfo: VersionInfo): string {
  let result = `${versionInfo.major}.${versionInfo.minor}`;
  if (versionInfo.build !== undefined) {
    result += `.${versionInfo.build}`;
  }
  if (versionInfo.tag) {
    result += `-${versionInfo.tag}`;
  }
  return result;
}

export function replaceVersion(input: string, version: string): string {
  return input.replace(assemblyVersionRegExp, `AssemblyVersion("${version}")`);
}

export function getGithubToken(): string {
  const envToken = process.env.GITHUB_TOKEN;
  const inputToken = getInput('GITHUB_TOKEN', { trimWhitespace: true });
  const token = envToken ?? inputToken;
  if (!token) {
    throw new Error('GITHUB_TOKEN is not provided');
  }
  return token;
}
