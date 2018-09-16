const fs = require('fs');
const request = require('request');
const { headerTemplate, userTemplate } = require('./template');

//todo replace owner and repo with values pulled from git environments
const contributors = process.env.CONTRIBUTORS || 'CONTRIBUTORS.md';
const owner = process.env.OWNER || 'jwu910';
const repo = process.env.REPO || 'check-it-out';

let options = {
  method: 'GET',
  url: `https://api.github.com/repos/${owner}/${repo}/contributors`,
  headers: {
    'Cache-Control': 'no-cache',
    'User-Agent': 'contri-credit'
  }
};

request(options, function(error, response, body) {
  if (error) throw new Error(error);

  const userList = JSON.parse(body);

  const writeStream = fs.createWriteStream(contributors);

  writeStream.write(headerTemplate(userList.length));

  userList.map(user => {
    writeStream.write(
      userTemplate(user.contributions, user.html_url, user.login)
    );
  });

  writeStream.end();
});
