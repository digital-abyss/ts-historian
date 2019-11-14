import fs from 'fs';

export interface Config {
    github: {
        userName: string,
        userSecret: string,
        baseURL: string
    },
    jira: {
        userName: string,
        userSecret: string,
        baseURL: string,
        projectKeys: [string]
    }
}

export function loadConfig(config: string) {
    let loadedFile = fs.readFileSync(config, { 'encoding': 'utf-8', 'flag': 'r' });
    let loadedConfig: Config = JSON.parse(loadedFile);
    return loadedConfig;
}