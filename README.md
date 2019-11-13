# ts-historian: a tool for automated release note generation

## Usage:
```
 npm run ts-node prs -b sha1 -d sha2 -r my-repo -o repo-owner -c path/to/config
 ```
 
 ## Sample Configuration:
 ```json
{
    "github": {
        "userName": "github-user",
        "userSecret": "github-token",
        "repoHost": "https://api.github.com"
    }
}
 ```

 ## Examples:
 
 ```bash
npm run ts-node -- prs -b 1.4.0 -d master -r typed-rest-client -c ./ts-historian.json -o microsoft
 ```
