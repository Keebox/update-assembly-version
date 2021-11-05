import { getBooleanInput, getInput } from '@actions/core';
import { Inputs } from './types';

export function getGithubToken(): string {
  const envToken = process.env.GITHUB_TOKEN;
  const inputToken = getInput('GITHUB_TOKEN');
  const token = envToken ?? inputToken;
  if (!token) {
    throw new Error('GITHUB_TOKEN is not provided');
  }
  return token;
}

export function getInputs(): Inputs {
  return {
    token: getGithubToken(),
    assemblyFile: getInput('assembly-file', { required: true }),
    increaseMajor: getBooleanInput('increase-major', { required: true }),
    increaseMinor: getBooleanInput('increase-minor', { required: true }),
    increaseBuild: getBooleanInput('increase-build', { required: true }),
    tag: getInput('tag') || undefined,
    branch: getInput('branch') || undefined,
    makeCommit: getBooleanInput('make-commit', { required: true }),
  };
}
