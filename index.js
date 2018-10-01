#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { headerTemplate, userTemplate } = require('./template');

const pkg = require(path.resolve(process.cwd(), 'package.json'));

function main(
  file = 'CONTRIBUTORS.md',
  owner = 'the-after-hours',
  repo = 'contri-credit'
) {
  process.stdout.write('Getting contributor information...\n');

/**
* @todo: Check if we can pull contributors from branches other than master
* @body: Currently we only pull the contributors from master, this means that whenever someone
* pushes to master they will be missing contributors.
*/
  axios({
    baseURL: 'https://api.github.com/',
    method: 'GET',
    url: `/repos/${owner}/${repo}/contributors`,
    headers: {
      'Cache-Control': 'no-cache',
      'User-Agent': owner
    }
  })
    .catch(function(error) {
      process.stderr.write(`
        Unable to request contirbutors.\n
        Please ensure you have set up your package.json with the correct configurations
        See our readme at https://github.com/the-after-hours/contri-credit
        file: ${file}
        owner: ${owner}
        repo: ${repo}\n
      `);

      process.stderr.write(error);
    })
    .then(function(response) {
      process.stdout.write(
        'Reponse received. Generating contributor file...\n'
      );

      const userList = response.data;

      const writeStream = fs.createWriteStream(file);

      if (repo === 'contri-credit') {
        writeStream.write(
          'This template was generated by The After Hours\'s Contri-Credit project.\n' +
          'If you have not set your package.json, please see our\n' +
          '[README](https://github.com/the-after-hours/contri-credit#readme)\n\n'
        );
      }

      writeStream.write(headerTemplate(userList.length));

      userList.map(user => {
        writeStream.write(
          userTemplate(user.contributions, user.html_url, user.login)
        );
      });

      writeStream.end();
    });
}

if (!pkg['contri-credit']) {
  process.stdout.write(
    'Please add your contri-credit configs to your package.json and try again.\n'
  );
  process.exit(1);
}

/**
 * @todo: Check for existing CONTRIBUTORS.md
 * @body: We should prompt the user to continue if they are about to overwrite a file
 */

main(
  pkg['contri-credit'].file,
  pkg['contri-credit'].owner,
  pkg['contri-credit'].repo
);
