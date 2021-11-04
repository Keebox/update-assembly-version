export type VersionInfo = {
  major: number;
  minor: number;
  build?: number;
  tag?: string;
};

export type CommitInfo = {
  githubToken: string;
  message: string;
  repo: string;
  owner: string;
  ref: string;
  file: {
    path: string;
    content: string;
  };
};
