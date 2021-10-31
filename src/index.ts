import { getInput, setFailed, getBooleanInput, info } from '@actions/core';
import { readFileSync, writeFileSync } from 'fs';
import { createCommit } from './git';
import {
  buildVersionString,
  findAssemblyVersion,
  parseVersion,
  replaceVersion,
} from './utils';

const main = async () => {
  try {
    const githubToken = getInput('GITHUB_TOKEN', {
      trimWhitespace: true,
      required: true,
    });
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

    if (!process.env.GITHUB_REPOSITORY) {
      throw new Error('Cannot get Github repository from environment variable');
    }
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    let ref: string;
    if (process.env.GITHUB_HEAD_REF) {
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
      githubToken,
      message: `Update version from ${version} to ${newVersion}`,
      owner,
      repo,
      ref,
    });
  } catch (error) {
    setFailed(error as Error);
  }
};

main();
