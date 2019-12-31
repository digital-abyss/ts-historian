
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
    public async createPullRequest(title: string, pullRequestBody: string, headBranch: string, baseBranch: string) : Promise<GithubPullRequestOpenResponse> {
        let path = 'repos/' + this.owner + '/' + this.repository + '/pulls';

        let requestBody = {
            title: title,
            head: headBranch,
            base: baseBranch,
            body: pullRequestBody,
            maintainer_can_modify: true,
            draft: false
        };

        let response: rm.IRestResponse<GithubPullRequestOpenResponse> = await this.restClient.create(path, requestBody);
        if (response.statusCode != 201 || !response.result) {
            console.log(response);
            throw new Error();
        }
        return Promise.resolve(response.result);
 
    }
    
    public async getShaForBranch(branchName: string): Promise<string> {
        let path = 'repos/' + this.owner + '/' + this.repository + '/git/refs/heads/' + branchName;

        let response: rm.IRestResponse<GithubRefsResponse> = await this.restClient.get(path); 
         if (response.statusCode != 200 || !response.result) {
            console.log(response);
            throw new Error();
        }
        return Promise.resolve(response.result.object.sha);
    }
    
    public async createBranchFromSha(branchName: string, sha: string): Promise<{}> {
        let path = 'repos/' + this.owner + '/' + this.repository + '/git/refs';

        let body = {
            ref: 'refs/heads/' + branchName,
            sha: sha
        };

        let response: rm.IRestResponse<{}> = await this.restClient.create(path, body); 
        if (response.statusCode != 201 || !response.result) {
            console.log("ERROR ERROR!");
            console.log("statusCode = " + response.statusCode);
            console.log(response);
            throw new Error();
        }
        console.log("I AM HERE!");
        return Promise.resolve(response.result);
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

export interface GithubPullRequestOpenResponse {
    url: string,
    html_url: string,
    number: Number,
    state: string
}

export interface GithubRefsResponse {
    object: {
        sha: string
    }
}