import {
  getInput,
  setFailed,
  getBooleanInput,
  info,
  setOutput,
} from '@actions/core';
import { readFileSync, writeFileSync } from 'fs';
import { createCommit } from './git';
import {
  buildVersionString,
  findAssemblyVersion,
  getGithubToken,
  parseVersion,
  replaceVersion,
} from './utils';

const main = async () => {
  try {
    const token = getGithubToken();
    const assemblyFile = getInput('assembly-file', {
      trimWhitespace: true,
      required: true,
    });
    const increaseMajor = getBooleanInput('increase-major', {
      trimWhitespace: true,
    });
    const increaseMinor = getBooleanInput('increase-minor', {
      trimWhitespace: true,
    });
    const increaseBuild = getBooleanInput('increase-build', {
      trimWhitespace: true,
    });
    const tag = getInput('tag', { trimWhitespace: true });
    const branch = getInput('branch', { trimWhitespace: true });

    const file = readFileSync(assemblyFile, { encoding: 'utf8' });
    const version = findAssemblyVersion(file);
    const versionInfo = parseVersion(version);
    if (increaseBuild) {
      versionInfo.build =
        versionInfo.build !== undefined ? versionInfo.build + 1 : 1;
      versionInfo.tag = undefined;
    }
    if (increaseMinor) {
      versionInfo.minor += 1;
      versionInfo.build = undefined;
      versionInfo.tag = undefined;
    }
    if (increaseMajor) {
      versionInfo.major += 1;
      versionInfo.minor = 0;
      versionInfo.build = undefined;
      versionInfo.tag = undefined;
    }
    if (tag) {
      versionInfo.tag = tag;
    }
    const newVersion = buildVersionString(versionInfo);
    const newFile = replaceVersion(file, newVersion);
    writeFileSync(assemblyFile, newFile);
    if (!process.env.GITHUB_REPOSITORY) {
      throw new Error('Cannot get Github repository from environment variable');
    }
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    let ref: string;
    if (branch) {
      ref = `heads/${branch}`;
    } else if (process.env.GITHUB_HEAD_REF) {
      ref = `heads/${process.env.GITHUB_HEAD_REF}`;
    } else {
      if (!process.env.GITHUB_REF) {
        throw new Error('Cannot get Github ref');
      }
      ref = process.env.GITHUB_REF;
    }
    ref = ref.replace('refs/', '');
    info(`Using ${ref} ref`);
    await createCommit({
      file: {
        content: newFile,
        path: assemblyFile,
      },
      githubToken: token,
      message: `Update version from ${version} to ${newVersion}`,
      owner,
      repo,
      ref,
    });
    setOutput('old-version', version);
    setOutput('new-version', newVersion);
  } catch (error) {
    setFailed(error as Error);
  }
};

main();
