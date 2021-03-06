#!/usr/bin/env node
import commander from 'commander';
import chalk from 'chalk';
import {GithubAPI} from './github/githubAPI'
import {loadConfig, Config} from './config/configLoader'
import Handlebars from "handlebars"
import fs from "fs"

//Sample command: npm run ts-node -- prs -b 1.4.0 -d master -r typed-rest-client -c ./nhistorian.json -o microsoft

commander
    .version('0.0.1')
    .description('A tool for creating release notes');

commander
    .command('prs')
    .option('-b, --base <baseTag>', 'base tag/sha/branch')
    .option('-d, --delta <deltaTag>', 'tag/sha/branch with the incremental change')
    .option('-r, --repo <repo>', 'repository name')
    .option('-c, --config <config>', 'configuration file path')
    .option('-o, --owner <owner>', 'repository owner name')
    .description('List pull requests between two tags/shas/branches')
    .action( async (cmdObj) => {
        //console.log(process.argv);
        console.log(chalk.yellow('~~~~~~~Historian: a tool for sumarizing changes~~~~~~~'))

        let loadedConfig: Config = loadConfig(cmdObj.config);

        console.log(loadedConfig)

        let githubAPI = new GithubAPI(  loadedConfig.github.baseURL,
                                        cmdObj.owner,
                                        cmdObj.repo,
                                        loadedConfig.github.userName,
                                        loadedConfig.github.userSecret
                                    );

	let source = fs.readFileSync(loadedConfig.template, {"encoding": "utf-8", "flag": "r"});
	let template = Handlebars.compile(source)
	
        let commits = await githubAPI.getCommitsBetweenTwoTags(cmdObj.base, cmdObj.delta);
	let prs = githubAPI.GetPullRequestsFromCommits(commits);

        for (let pr of prs) {
	    console.log(template(pr))
        }


	//console.log('PRs:');
	console.log(githubAPI.GetPullRequestsFromCommits(commits));
    });


commander.parse(process.argv);


