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

export type Inputs = {
  token?: string;
  assemblyFile: string;
  increaseMajor: boolean;
  increaseMinor: boolean;
  increaseBuild: boolean;
  tag?: string;
  branch?: string;
  makeCommit: boolean;
};
