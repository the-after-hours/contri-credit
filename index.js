
const request = require("request");

//todo replace owner and repo with values pulled from git environments
const owner = process.env.OWNER || 'jwu910';
const repo = process.env.REPO || 'check-it-out';

let options = {
    method: 'GET',
    url: `https://api.github.com/repos/${owner}/${repo}/contributors`,
    headers:
    {
        'Cache-Control': 'no-cache', 
        'User-Agent': 'contri-credit'
    }
};

request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
});

