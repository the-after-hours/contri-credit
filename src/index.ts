import { Application } from 'probot'

export = (app: Application) => {
  app.log('Yay, the app was loaded!')
 /* Using wildcard event to catch anything our app already listens to
  app.on(`*`, async context => {
    context.log({ event: context.event, action: context.payload.action })
  })
  */
  app.on(`*`, async context => {
    console.log(`We should grab the person and the thing -- ${context.name} -- and add their name to the contributors file, .github/contri-credit.md`);
    if (context.name === 'push') {
      console.log(`${context.payload.pusher.name} just did a ${context.name}`);
    }
    else if (context.name === 'create') {
      console.log(`${context.payload.sender.login} just did a ${context.name} AKA Pull Request`);
    }
    else {
      console.log(context)
    }

    // Updating file based on info from github octokit
      // https://octokit.github.io/rest.js/#api-Repos-updateFile
    let owner = 'rainrivas',
      branch = 'test-branch2',
      // committer = { name: 'Efrain \'Rain\' Rivas', email: 'rainrivas@gmail.com' },
      fileBody = '\nAdding new contribs to the magic file',//'c2FtcGxlIHRlc3QgZmlsZQ==',
      message = 'Modifying contrib file',
      path = '.github/contri-credit.md',
      repo = 'probot-test-playground',
      sha = 'ac85ae3242b0e7e1c9d69b6d33c1d382816f9dc9'; // currently this is hard coded, we need to make a GET action to figure out if this file exists to grab sha

      // file contents need to be encoding so doing that here
    let buff = new Buffer(fileBody);
    let content = buff.toString('base64');

    // Need to make the call to figure out if the file already exists and if it does we need to grab it's sha so we can pass it to the "udpate" file command.

    // await context.github.repos.createFile({ owner, repo, path, message, content, branch, committer }); // create the file
    const res = await context.github.repos.updateFile({ owner, repo, path, message, content, sha, branch }); // update a created file

    return console.info(res)

    // For more information on building apps:
    // https://probot.github.io/docs/

    // To get your app running against GitHub, see:
    // https://probot.github.io/docs/development/
  });
}
