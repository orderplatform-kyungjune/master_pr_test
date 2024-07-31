import * as core from '@actions/core';
import * as github from '@actions/github';
import fs from 'fs';
import {
  getSingleObject,
  putObject,
  putObjectFile,
  invalidateCloudFrontCache,
} from './utils/s3.mjs';

const { AWS_DISTRIBUTION_ID, GITHUB_TOKEN } = process.env;


async function getNextVersion() {
  try {
    const CURRENT_VERSION_KEY = 'currentVersion.json';
    const octokit = github.getOctokit(GITHUB_TOKEN);
    const context = github.context;

    const latestVersionData = await getSingleObject(CURRENT_VERSION_KEY);

    let currentVersion = {
      major: 1,
      minor: 0,
      patch: 0,
    };

    if (latestVersionData) {
      currentVersion = JSON.parse(latestVersionData);
    }

    // 마지막 릴리즈 날짜 가져오기
    const { data: releases } = await octokit.rest.repos.listReleases({
      owner: context.repo.owner,
      repo: context.repo.repo,
      per_page: 1
    });
    const lastReleaseDate = new Date(releases[0].created_at);

    console.log('lastReleaseDate : ', lastReleaseDate);

    // 해당 날짜 이후로 닫힌 모든 PR을 검색합니다.
    const { data: prs } = await octokit.rest.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'closed',
      sort: 'updated',
      direction: 'desc',
    });

    console.log('prs : ', prs);

    let hasFeature = false;

    for (let pr of prs) {
      const prDate = new Date(pr.closed_at);
      if (prDate > lastReleaseDate) {
        if (pr.head.ref.startsWith("feature")) {
          hasFeature = true;
          break;
        }
      }
    }

    if (latestVersionData) {
      if (hasFeature) {
        currentVersion.minor += 1;
        currentVersion.patch = 0;
      } else {
        currentVersion.patch += 1;
      }
    }

    await putObjectFile(CURRENT_VERSION_KEY, Buffer.from(JSON.stringify(currentVersion)));
    core.setOutput('version', `v${currentVersion.major}.${currentVersion.minor}.${currentVersion.patch}`);
    return currentVersion;
  } catch (e) {
    console.error(e);
  }
}

const uploadFileToS3 = async (dirName, fileName, removePath, versions) => {
  const replaceDirName = `v/${versions.major}/${versions.minor}/${versions.patch}/${dirName.replace(removePath, '')}`;

  const data = fs.readFileSync(`${dirName}/${fileName}`);
  return putObject(replaceDirName, fileName, data);
};

const convertFileList = (pathName, removePath, promiseList, versions) => {
  const isExistFile = fs.existsSync(pathName);

  if (!isExistFile) return;

  const fileList = fs.readdirSync(pathName);

  fileList.forEach((fileName) => {
    // 소스맵 파일은 건너뜀
    if (fileName.endsWith('.map')) return;

    const realPathName = `${pathName}/${fileName}`;
    if (fs.lstatSync(realPathName).isDirectory()) {
      convertFileList(realPathName, removePath, promiseList, versions);
      return;
    }

    promiseList.push(uploadFileToS3(pathName, fileName, removePath, versions));
  });
};

async function main() {
  const versions = await getNextVersion();

  // dist 파일 업로드
  const uploadDir = [
    'assets',
    'fonts',
  ];

  const promises = uploadDir.map((dirName) => {
    const removePath = './dist/';
    const promiseList = [];

    convertFileList(`${removePath}${dirName}`, removePath, promiseList, versions);
    return promiseList;
  }).flat();


  const htmlFile = fs.readFileSync('./dist/index.html');

  const putHtmlList = putObject(`v/${versions.major}/${versions.minor}/${versions.patch}`, 'index.html', htmlFile);

  promises.push(putHtmlList);

  // 업로드 로직 종료시까지 대기
  await Promise.all(promises);

  if (AWS_DISTRIBUTION_ID) {
    await invalidateCloudFrontCache(5, AWS_DISTRIBUTION_ID);
  }
}

await main();
