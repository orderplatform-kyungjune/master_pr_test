import * as core from '@actions/core';
import * as github from '@actions/github';
import {
  listObjectsWithPrefix,
  deleteObjects,
} from './utils/s3.mjs';

const getBaseBranchName = () => {
  try {
    const { payload } = github.context;
    if (!payload.pull_request) {
      throw new Error("context 내 pr이 미존재");
    }
    return payload.pull_request.head.ref.split('/')[1];
  } catch (error) {
    core.setFailed(error.message);
  }
};

export async function deleteFilesUnderBaseBranch(baseBranchName) {
  const prefix = `qa/${baseBranchName}/`;

  try {
    const objects = await listObjectsWithPrefix(prefix);

    if (!objects.length) {
      console.log(`${prefix}에 해당되는 S3 객체가 존재하지 않습니다`);
      return;
    }

    const objectsToDelete = objects.map(obj => ({ Key: obj.Key }));
    deleteObjects(objectsToDelete);
    console.log(`${prefix} 테스트 삭제 완료`);
  } catch (error) {
    core.setFailed(`S3 삭제 실패: ${error.message}`);
  }
}

async function main() {
  const baseBranchName = getBaseBranchName();
  await deleteFilesUnderBaseBranch(baseBranchName);
}

await main();
