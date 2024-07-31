import * as core from '@actions/core';
import * as github from '@actions/github';

const { VERSION, GITHUB_TOKEN } = process.env;

async function createRelease() {
  try {
    const octokit = github.getOctokit(GITHUB_TOKEN);
    const context = github.context;

    const { data: releases } = await octokit.rest.repos.listReleases({
      owner: context.repo.owner,
      repo: context.repo.repo,
      per_page: 1
    });
    const lastReleaseDate = new Date(releases[0].created_at);

    const { data: prs } = await octokit.rest.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'closed',
      sort: 'updated',
      direction: 'desc',
    });

    let features = [];
    let SlackFeatures = [];
    let fixes = [];
    let SlackFixes = [];
    const jiraLink = "https://torderjira.atlassian.net/browse/";
    for (let pr of prs) {
      const prDate = new Date(pr.closed_at);
      if (prDate > lastReleaseDate) {
        const match = pr.title.match(/\[(\w+-\d+)\]\s+(.+)/);
        if (pr.head.ref.startsWith("feature")) {
          if (match) {
            const mrkdwn = `[${match[1]}](${jiraLink}${match[1]}) - [${match[2]}](${pr.html_url})`;
            const slackMrkdwn = `<${jiraLink}${match[1]}|${match[1]}> - <${pr.html_url}|${match[2]}>`
            features.push(mrkdwn);
            SlackFeatures.push(slackMrkdwn);
          } else {
            features.push(`${pr.title} - PR Title 규약 위배됨`);
            SlackFeatures.push(pr.title);
          }
        } else if (pr.head.ref.startsWith("fix")) {
          if (match) {
            const mrkdwn = `[${match[1]}](${jiraLink}${match[1]}) - [${match[2]}](${pr.html_url})`
            const slackMrkdwn = `<${jiraLink}${match[1]}|${match[1]}> - <${pr.html_url}|${match[2]}>`
            fixes.push(mrkdwn);
            SlackFixes.push(slackMrkdwn);
          } else {
            fixes.push(`${pr.title} - PR Title 규약 위배됨`);
            SlackFixes.push(pr.title);
          }
        }
      }
    }
    const releaseBody = `
# 마스터2 ${VERSION} 운영 배포 내역

## Feature
${features.join("\n")}

## Fix
${fixes.join("\n")}
    `;

    const release = await octokit.rest.repos.createRelease({
      owner: context.repo.owner,
      repo: context.repo.repo,
      tag_name: VERSION,
      name: `Master2 ${VERSION}`,
      body: releaseBody,
    });

    const releaseUrl = release.data.html_url;

    console.log(`Release created at ${releaseUrl}`);
    core.setOutput("release_url", releaseUrl);

    const releaseBodyForSlack = `*Feature*\\n${SlackFeatures.join("\\n")}\\n\\n*Fix*\\n${SlackFixes.join("\\n")}`;

    core.setOutput("release_body", releaseBodyForSlack);
  } catch (error) {
    core.setFailed(error.message);
  }
}

createRelease().catch(error => {
  console.error(error);
  process.exit(1);
});
