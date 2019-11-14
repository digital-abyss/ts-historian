
import * as rm from 'typed-rest-client/RestClient';
import * as hm from 'typed-rest-client/Handlers';

export function sum(a: number, b:number) {
    return a + b;
}


export class GithubAPI {
    baseURL: string;
    owner: string;
    repository: string;
    restClient: rm.RestClient;

    public constructor(baseURL: string, owner: string, repository: string, userName: string, userSecret: string) {
        this.baseURL = baseURL;
        this.owner = owner;
        this.repository = repository;
        const basicHandler: hm.BasicCredentialHandler = new hm.BasicCredentialHandler(userName, userSecret);
        this.restClient = new rm.RestClient('no-agent', this.baseURL, [basicHandler]);
    }

    public async getCommitsBetweenTwoTags(baseTag: string, deltaTag: string): Promise<[GithubCommit]> {  
        //'/api/v3/repos/'
        let path = 'repos/' + this.owner + '/' + this.repository + '/compare/' + baseTag + '...' + deltaTag;
        console.log(path);

        let response : rm.IRestResponse<GithubCommitsResponse> = await this.restClient.get<GithubCommitsResponse>(path);

        //console.log(response.result);

        if (response.statusCode != 200 || !response.result) {
            console.log(response);
            throw new Error();
        }
        return Promise.resolve(response.result.commits);
    }

    GetPullRequestsFromCommits(githubAPICommits: Array<GithubCommit>) : Array<GithubPullRequest> {
        let regex = /Merge pull request #[0-9].* from /;
        let pullRequests: Array<GithubPullRequest> = [];

        for( let commit of githubAPICommits) {
            //console.log(commit.commit.message.search(regex));
            if(commit.commit.message.search(regex) === 0) {

                let numberEndRegex = / from /;
                let endIndex = commit.commit.message.search(numberEndRegex);
                let startIndex = 20;

                let pr:GithubPullRequest = {
                    prNumber: parseInt(commit.commit.message.slice(startIndex, endIndex)), //should be 176
                    commit: commit
                }
                pullRequests.push(pr);
            }
        }
        return pullRequests;
    }
}

export interface GithubPullRequest {
    prNumber: number,
    commit: GithubCommit
}
export interface GithubPerson {
    login: string,
    id: number,
    url: string,
    type: string,
    site_admin: boolean
}
export interface Person {
    name: string,
    email: string,
    date: string
}
export interface Commit {
    author: Person
    commitor: Person,
    message: string,
    tree: {},
    url: string
}
export interface GithubCommit {
    sha: string,
    node_id: string,
    commit: Commit,
    url: string,
    html_url: string,
    author: GithubPerson

}
export interface GithubCommitsResponse {
    url: string,
    commits: [GithubCommit]
}