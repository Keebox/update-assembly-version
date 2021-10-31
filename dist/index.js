/******/ (() => { // webpackBootstrap
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
System.register(["@actions/core", "fs", "./git", "./utils"], function (exports_1, context_1) {
    "use strict";
    var core_1, fs_1, git_1, utils_1;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (fs_1_1) {
                fs_1 = fs_1_1;
            },
            function (git_1_1) {
                git_1 = git_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: async function () {
            try {
                const githubToken = core_1.getInput('GITHUB_TOKEN', {
                    trimWhitespace: true,
                    required: true,
                });
                const assemblyFile = core_1.getInput('assembly-file', {
                    trimWhitespace: true,
                    required: true,
                });
                const increaseBuild = core_1.getBooleanInput('increase-build', {
                    trimWhitespace: true,
                });
                const increaseRelease = core_1.getBooleanInput('increase-release', {
                    trimWhitespace: true,
                });
                const tag = core_1.getInput('tag', {
                    trimWhitespace: true,
                });
                const file = fs_1.readFileSync(assemblyFile, { encoding: 'utf8' });
                const version = utils_1.findAssemblyVersion(file);
                const versionInfo = utils_1.parseVersion(version);
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
                const newVersion = utils_1.buildVersionString(versionInfo);
                const newFile = utils_1.replaceVersion(file, newVersion);
                fs_1.writeFileSync(assemblyFile, newFile);
                if (!process.env.GITHUB_REPOSITORY) {
                    throw new Error('Cannot get Github repository from environment variable');
                }
                const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
                await git_1.createCommit({
                    file: {
                        content: newFile,
                        path: assemblyFile,
                    },
                    githubToken,
                    message: `Update version from ${version} to ${newVersion}`,
                    owner,
                    repo,
                });
            }
            catch (error) {
                core_1.setFailed(error);
            }
        }
    };
});

module.exports = __webpack_exports__;
/******/ })()
;