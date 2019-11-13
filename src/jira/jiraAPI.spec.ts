import {JiraAPI, JiraItem} from './jiraAPI';
import {loadConfig, Config} from '../config/configLoader';


var myJIRA: JiraAPI;

beforeAll(async () => {

    let config: Config = loadConfig('./ts-historian.json');

    myJIRA = new JiraAPI(config.jira.baseURL, config.jira.userName, config.jira.userSecret);

});

test('Integration Test: Get details of story TEST1-1', async () => {

    let jiraItem: JiraItem = await myJIRA.getItem('TEST1-1');

    expect(jiraItem.fields.summary).toEqual('Story1');

});