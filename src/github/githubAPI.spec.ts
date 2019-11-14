import {sum, GithubAPI, GithubCommit} from './githubAPI';
import { AssertionError } from 'assert';

import {loadConfig, Config} from '../config/configLoader';

var myGithub: GithubAPI;
var githubAPICommits : [GithubCommit];

beforeAll(async () => {

    let config: Config = loadConfig('./ts-historian.json');

    myGithub = new GithubAPI( config.github.baseURL,
                            'microsoft',
                            'typed-rest-client',
                            config.github.userName,
                            config.github.userSecret
                            );

    githubAPICommits = await myGithub.getCommitsBetweenTwoTags('1.4.0', 'master');

});


test('adds 1 + 2 to equal 3', () => {
    expect(sum(1,2)).toBe(3);
})

test('Integration Test: Get Commits from Github API', async () => {

    expect(githubAPICommits).toHaveLength(18);
});

test('Unit Test: Find Pull Requests from Commits', () => {
    let pullRequests = myGithub.GetPullRequestsFromCommits(githubAPICommits);

    expect(pullRequests).toHaveLength(1);
    expect(pullRequests[0].prNumber).toEqual(176);
});

test('Unit Test: Passing in Empty List of Commits returns an Empty List of Pull Requests', () => {
    let pullRequests = myGithub.GetPullRequestsFromCommits([]);

    expect(pullRequests).toHaveLength(0);
});