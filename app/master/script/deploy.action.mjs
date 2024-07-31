import fs from 'fs';
import {
  deleteObjects,
  getObjects,
  putObject,
  invalidateCloudFrontCache,
  // eslint-disable-next-line import/extensions
} from './utils/s3.mjs';

const { AWS_DISTRIBUTION_ID } = process.env;

async function main() {
  // dist 파일 업로드
  const uploadDir = [
    'js',
    'css',
    'img',
  ];
  const promises = uploadDir.map(() => {
    const fileList = fs.readdirSync('./dist/assets');
    const promise = fileList.map((fileName) => {
      const data = fs.readFileSync(`./dist/assets/${fileName}`);
      return putObject('assets', fileName, data);
    });
    return promise;
  }).flat();

  // index.html 업로드
  const htmlFile = fs.readFileSync('./dist/index.html');
  const putHtmlList = putObject('', 'index.html', htmlFile);
  promises.push(putHtmlList);

  // favicon 업로드
  const faviconFile = fs.readFileSync('./dist/favicon.svg');
  const putFavicon = putObject('', 'favicon.svg', faviconFile);
  promises.push(putFavicon);

  // 업로드 로직 종료시까지 대기
  await Promise.all(promises);
  // 현재 시간 타임스탬프
  const nowDateTimeStamp = +new Date() / 1000;

  // 버킷 object get
  const bucketFiles = await getObjects();
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
    await deleteObjects(oldFiles);
  }

  if (AWS_DISTRIBUTION_ID) {
    invalidateCloudFrontCache(5, AWS_DISTRIBUTION_ID);
  }
}

main();
