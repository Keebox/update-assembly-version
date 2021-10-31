import { VersionInfo } from '../types';
import {
  buildVersionString,
  findAssemblyVersion,
  parseVersion,
  replaceVersion,
} from '../utils';

describe('findAssemblyVersion', () => {
  it('should find valid AssemblyVersion', () => {
    const result = findAssemblyVersion('AssemblyVersion("1.2")');
    expect(result).toEqual('1.2');
  });

  it('should find valid AssemblyVersion with tag', () => {
    const result = findAssemblyVersion('AssemblyVersion("1.2-beta")');
    expect(result).toEqual('1.2-beta');
  });

  it('should throw error', () => {
    expect(() => findAssemblyVersion('Random string')).toThrow();
  });
});

describe('parseVersion', () => {
  it('should parse valid version', () => {
    const result = parseVersion('4.56');
    expect(result.release).toBe(4);
    expect(result.build).toBe(56);
    expect(result.tag).toBeUndefined();
  });

  it('should parse valid version with tag', () => {
    const result = parseVersion('4.56-beta');
    expect(result.release).toBe(4);
    expect(result.build).toBe(56);
    expect(result.tag).toEqual('beta');
  });

  it('should not parse invalid version', () => {
    expect(() => parseVersion('1.2.3')).toThrow();
  });
});

describe('buildVersionString', () => {
  it.each<VersionInfo & { result: string }>([
    {
      release: 3,
      build: 56,
      result: '3.56',
    },
    {
      release: 3,
      build: 56,
      tag: 'beta',
      result: '3.56-beta',
    },
  ])('should build version $result from info', ({ result, ...versionInfo }) => {
    const version = buildVersionString(versionInfo);
    expect(version).toEqual(result);
  });
});

describe('replaceVersion', () => {
  it('should replace version', () => {
    const result = replaceVersion('AssemblyVersion("1.2")', '1.3-beta');
    expect(result).toEqual('AssemblyVersion("1.3-beta")');
  });
});
