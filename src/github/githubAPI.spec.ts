import {sum, GithubAPI, GithubCommit} from './githubAPI';
import { AssertionError } from 'assert';

import {loadConfig, Config} from '../config/configLoader';

var myGithub: GithubAPI;
var githubAPICommits : [GithubCommit];

beforeAll(async () => {

    let config: Config = loadConfig('./ts-historian.json');

    myGithub = new GithubAPI( config.github.baseURL,
                            'digital-abyss',
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

    expect(githubAPICommits).toHaveLength(37);
});

test('Unit Test: Find Pull Requests from Commits', () => {
    let pullRequests = myGithub.GetPullRequestsFromCommits(githubAPICommits);

    expect(pullRequests).toHaveLength(2);
    expect(pullRequests[0].prNumber).toEqual(176);
});

test('Unit Test: Passing in Empty List of Commits returns an Empty List of Pull Requests', () => {
    let pullRequests = myGithub.GetPullRequestsFromCommits([]);

    expect(pullRequests).toHaveLength(0);
});

test('Integration Test: Create a pull request using github\'s API', async () => {

    let requestBody = `| PR number | JIRA ticket | author | PO approver |
|----------|----------|----------|----------|
| #12      | [TEST1-1](http://localhost:8089/stories/test1-1) | @digital-abyss | some po|    
    `

//    let response = await myGithub.createPullRequest('sample title', requestBody, 'ian-test-branch', 'master');
    
//    expect(response.state).toBe('open');
    
 });

test('Integration Test: Get a branch\'s SHA using github\'s API', async () => {

    let response = await myGithub.getShaForBranch('ian-test-branch');

    expect(response).toBe('ee8b81eeddf058ca3676fbc046900dd40a28f700');

});

test('Integration Test: Create a new branch from a sha', async () => {

    let response = await myGithub.createBranchFromSha('ian-test-branch-3', 'ee8b81eeddf058ca3676fbc046900dd40a28f700');
    console.log(response);
})