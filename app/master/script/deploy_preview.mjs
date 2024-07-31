import * as core from '@actions/core';
import * as github from '@actions/github';
import fs from 'fs';
import {
  putObject,
  invalidateCloudFrontCache, getObjects, deleteObjects,
} from './utils/s3.mjs';

const { AWS_DISTRIBUTION_ID } = process.env;

const getBaseBranchName = () => {
  try {
    const { payload } = github.context
    if (!payload.pull_request) {
      throw new Error("github.context 내 pr 미존재로 에러");
    }
    return payload.pull_request.head.ref.split('/')[1];
  } catch (error) {
    core.setFailed(error.message);
  }
};

const uploadFileToS3 = async (dirName, fileName, removePath, baseBranchName) => {
  const replaceDirName = `qa/${baseBranchName}/${dirName.replace(removePath, '')}`;

  const data = fs.readFileSync(`${dirName}/${fileName}`);
  core.setOutput('domain', baseBranchName);
  return putObject(replaceDirName, fileName, data);
};

const convertFileList = (pathName, removePath, promiseList, baseBranchName) => {
  const isExistFile = fs.existsSync(pathName);

  if (!isExistFile) return;

  const fileList = fs.readdirSync(pathName);

  fileList.forEach((fileName) => {
    const realPathName = `${pathName}/${fileName}`;
    if (fs.lstatSync(realPathName).isDirectory()) {
      convertFileList(realPathName, removePath, promiseList);
      return;
    }

    promiseList.push(uploadFileToS3(pathName, fileName, removePath, baseBranchName));
  });
};

async function main() {
  const baseBranchName = getBaseBranchName();

  // dist 파일 업로드
  const uploadDir = [
    'assets',
    'fonts',
  ];

  const promises = uploadDir.map((dirName) => {
    const removePath = './dist/';
    const promiseList = [];

    convertFileList(`${removePath}${dirName}`, removePath, promiseList, baseBranchName);
    return promiseList;
  }).flat();


  const htmlFile = fs.readFileSync('./dist/index.html');

  const putHtmlList = putObject(`qa/${baseBranchName}`, 'index.html', htmlFile);

  promises.push(putHtmlList);

  // 업로드 로직 종료시까지 대기
  await Promise.all(promises);

  const nowDateTimeStamp = +new Date() / 1000;

  // 버킷 object get
  const bucketFiles = await getObjects(`qa/${baseBranchName}/`);
  const oldFiles = bucketFiles.Contents.filter(({
    Key,
    LastModified,
  }) => {
    if (Key.includes('robot')) return false;
    const lastModifiedTimeStamp = Math.floor(+new Date(LastModified)) / 1000;
    // 파일이 업로드 시간보다 10초 지났을시 삭제처리
    return (nowDateTimeStamp - lastModifiedTimeStamp) > 10;
  });

  // 오래된 파일 존재시 버킷 object delete
  if (oldFiles.length > 0) {
    const filesToDelete = oldFiles.filter(file => file.Key.startsWith(`qa/${baseBranchName}/`));
    if (filesToDelete.length > 0) {
      await deleteObjects(filesToDelete);
    }
  }

  if (AWS_DISTRIBUTION_ID) {
    await invalidateCloudFrontCache(5, AWS_DISTRIBUTION_ID);
  }
}

await main();
