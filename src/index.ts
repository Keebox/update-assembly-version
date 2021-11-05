import { setFailed, info, setOutput, debug } from '@actions/core';
import { readFileSync, writeFileSync } from 'fs';
import { createCommit } from './git';
import { getInputs } from './input';
import {
  buildVersionString,
  findAssemblyVersion,
  parseVersion,
  replaceVersion,
} from './utils';

const main = async () => {
  try {
    debug('Getting inputs');
    const {
      assemblyFile,
      increaseBuild,
      increaseMinor,
      increaseMajor,
      token,
      makeCommit,
      branch,
      tag,
    } = getInputs();

    debug('Reading assembly file');
    const file = readFileSync(assemblyFile, { encoding: 'utf8' });
    debug('Getting assembly version');
    const version = findAssemblyVersion(file);
    debug('Parsing version info');
    const versionInfo = parseVersion(version);
    if (increaseBuild) {
      debug('Increasing build number');
      versionInfo.build =
        versionInfo.build !== undefined ? versionInfo.build + 1 : 1;
      versionInfo.tag = undefined;
    }
    if (increaseMinor) {
      debug('Increasing minor number');
      versionInfo.minor += 1;
      versionInfo.build = undefined;
      versionInfo.tag = undefined;
    }
    if (increaseMajor) {
      debug('Increasing major number');
      versionInfo.major += 1;
      versionInfo.minor = 0;
      versionInfo.build = undefined;
      versionInfo.tag = undefined;
    }
    if (tag) {
      debug('Setting tag');
      versionInfo.tag = tag;
    }
    debug('Building new version');
    const newVersion = buildVersionString(versionInfo);
    debug('Replacing version');
    const newFile = replaceVersion(file, newVersion);
    debug('Writing new file');
    writeFileSync(assemblyFile, newFile);
    if (!process.env.GITHUB_REPOSITORY) {
      throw new Error('Cannot get Github repository from environment variable');
    }
    debug('Getting owner and repo');
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    let ref: string;
    if (branch) {
      debug('Using branch');
      ref = `heads/${branch}`;
    } else if (process.env.GITHUB_HEAD_REF) {
      debug('Using head ref');
      ref = `heads/${process.env.GITHUB_HEAD_REF}`;
    } else {
      if (!process.env.GITHUB_REF) {
        throw new Error('Cannot get Github ref');
      }
      debug('Using ref');
      ref = process.env.GITHUB_REF;
    }
    ref = ref.replace('refs/', '');
    info(`Using ${ref}`);
    if (makeCommit) {
      debug('Making commit');
      if (!token) {
        throw new Error('GITHUB_TOKEN is not provided');
      }
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
    }
    debug('Setting output');
    setOutput('old-version', version);
    setOutput('new-version', newVersion);
  } catch (error) {
    setFailed(error as Error);
  }
};

main();
