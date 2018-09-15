
var request = require("request");

var options = {
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

