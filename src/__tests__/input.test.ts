import { getInputs } from '../input';
import { getInput, getBooleanInput } from '@actions/core';

jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
  getBooleanInput: jest.fn(),
}));

const getInputMock = getInput as jest.MockedFunction<typeof getInput>;
const getBooleanInputMock = getBooleanInput as jest.MockedFunction<
  typeof getBooleanInput
>;

describe('getInputs', () => {
  it('Should return required inputs', () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'GITHUB_TOKEN':
          return 'token';
        case 'assembly-file':
          return 'file';
        default:
          return '';
      }
    });
    getBooleanInputMock.mockImplementation((name) => {
      switch (name) {
        case 'increase-build':
        case 'make-commit':
          return true;
        case 'increase-major':
        case 'increase-minor':
          return false;
        default:
          return false;
      }
    });
    const result = getInputs();
    expect(result.token).toEqual('token');
    expect(result.assemblyFile).toEqual('file');
    expect(result.increaseMajor).toBe(false);
    expect(result.increaseMinor).toBe(false);
    expect(result.increaseBuild).toBe(true);
    expect(result.tag).toBeUndefined();
    expect(result.branch).toBeUndefined();
    expect(result.makeCommit).toBe(true);
  });

  it('Should return required inputs with branch', () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'GITHUB_TOKEN':
          return 'token';
        case 'assembly-file':
          return 'file';
        case 'branch':
          return 'random-branch';
        default:
          return '';
      }
    });
    getBooleanInputMock.mockImplementation((name) => {
      switch (name) {
        case 'increase-build':
        case 'make-commit':
          return true;
        case 'increase-major':
        case 'increase-minor':
          return false;
        default:
          return false;
      }
    });
    const result = getInputs();
    expect(result.token).toEqual('token');
    expect(result.assemblyFile).toEqual('file');
    expect(result.increaseMajor).toBe(false);
    expect(result.increaseMinor).toBe(false);
    expect(result.increaseBuild).toBe(true);
    expect(result.tag).toBeUndefined();
    expect(result.branch).toEqual('random-branch');
    expect(result.makeCommit).toBe(true);
  });

  it('Should return required inputs with tag', () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'GITHUB_TOKEN':
          return 'token';
        case 'assembly-file':
          return 'file';
        case 'tag':
          return 'beta';
        default:
          return '';
      }
    });
    getBooleanInputMock.mockImplementation((name) => {
      switch (name) {
        case 'increase-build':
        case 'make-commit':
          return true;
        case 'increase-major':
        case 'increase-minor':
          return false;
        default:
          return false;
      }
    });
    const result = getInputs();
    expect(result.token).toEqual('token');
    expect(result.assemblyFile).toEqual('file');
    expect(result.increaseMajor).toBe(false);
    expect(result.increaseMinor).toBe(false);
    expect(result.increaseBuild).toBe(true);
    expect(result.tag).toEqual('beta');
    expect(result.branch).toBeUndefined();
    expect(result.makeCommit).toBe(true);
  });

  it('Should return required inputs with tag', () => {
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'GITHUB_TOKEN':
          return '';
        case 'assembly-file':
          return 'file';
        case 'tag':
          return 'beta';
        default:
          return '';
      }
    });
    getBooleanInputMock.mockImplementation((name) => {
      switch (name) {
        case 'increase-build':
        case 'make-commit':
          return true;
        case 'increase-major':
        case 'increase-minor':
          return false;
        default:
          return false;
      }
    });
    expect(() => getInputs()).toThrow();
  });
});
