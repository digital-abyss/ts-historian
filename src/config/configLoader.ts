import fs from 'fs';

export interface Config {
    github: {
        githubAccessString: string,
        userName: string,
        userSecret: string,
        repoHost: string
    }
}

export function loadConfig(config: string) {
    let loadedFile = fs.readFileSync(config, { 'encoding': 'utf-8', 'flag': 'r' });
    let loadedConfig: Config = JSON.parse(loadedFile);
    return loadedConfig;
}