import * as github from '@actions/github';
import * as core from '@actions/core';
import {
  getSingleObject,
} from './utils/s3.mjs';

const { GITHUB_TOKEN } = process.env;

async function getNextVersion() {
  try {
    const CURRENT_VERSION_KEY = 'currentVersion.json';
    const octokit = github.getOctokit(GITHUB_TOKEN);
    const { context } = github;

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
      per_page: 1,
    });
    const lastReleaseDate = new Date(releases[0].created_at);

    // 해당 날짜 이후로 닫힌 모든 PR을 검색합니다.
    const { data: prs } = await octokit.rest.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'closed',
      sort: 'updated',
      direction: 'desc',
    });

    let hasFeature = false;

    for (const pr of prs) {
      const prDate = new Date(pr.closed_at);
      if (prDate > lastReleaseDate) {
        if (pr.head.ref.startsWith('feature')) {
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

    core.setOutput('sentry', `master2@${currentVersion.major}.${currentVersion.minor}.${currentVersion.patch}`);
    return currentVersion;
  } catch (e) {
    console.log(e);
  }
}

await getNextVersion();
