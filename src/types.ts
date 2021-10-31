export type VersionInfo = {
  release: number;
  build: number;
  tag?: string;
};

export type CommitInfo = {
  githubToken: string;
  message: string;
  repo: string;
  owner: string;
  file: {
    path: string;
    content: string;
  };
};
