
import * as rm from 'typed-rest-client/RestClient';
import * as hm from 'typed-rest-client/Handlers';

export class JiraAPI {
    static readonly ITEM_REST_PATH = '/rest/api/2/issue/';
    baseURL: string;
    restClient: rm.RestClient;

    public constructor(baseURL: string, userName: string, userSecret: string) {
        this.baseURL = baseURL;
        const basicHandler: hm.BasicCredentialHandler = new hm.BasicCredentialHandler(userName, userSecret);
        this.restClient = new rm.RestClient('no-agent', this.baseURL, [basicHandler]);
    }

    public async getItem(itemKey: string): Promise<JiraItem> {
        let path = JiraAPI.ITEM_REST_PATH + itemKey;

        let response: rm.IRestResponse<JiraItem> = await this.restClient.get<JiraItem>(path);

        if (response.statusCode != 200 || !response.result) {
            console.log(response);
            throw new Error();
        }

        return Promise.resolve(response.result);
    }
}

export interface JiraItem {
    key: string;
    fields: JiraFields
}

export interface JiraFields {
    summary: string;
}