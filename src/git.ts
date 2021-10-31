import { getOctokit } from '@actions/github';
import { CommitInfo } from './types';

export async function createCommit({
  githubToken,
  message,
  owner,
  repo,
  file,
}: CommitInfo) {
  const octokit = getOctokit(githubToken);
  const blob = await octokit.rest.git.createBlob({
    owner,
    repo,
    content: file.content,
  });
  const baseTree = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: 'heads/master'
  })
  const tree = await octokit.rest.git.createTree({
    owner,
    repo,
    tree: [
      {
        path: file.path,
        sha: blob.data.sha,
        type: 'blob',
        mode: '100644',
      },
    ],
    base_tree: baseTree.data.object.sha
  });
  const commit = await octokit.rest.git.createCommit({
    message,
    owner,
    repo,
    tree: tree.data.sha,
  });
  await octokit.rest.git.updateRef({
    owner,
    repo,
    force: true,
    ref: `heads/master`,
    sha: commit.data.sha,
  });
}
