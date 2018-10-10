import { Application } from 'probot'

export = (app: Application) => {
  app.log('Yay, the app was loaded!')
  /* Using wildcard event to catch anything our app already listens to
   app.on(`*`, async context => {
     context.log({ event: context.event, action: context.payload.action })
   })
   */
  app.on(`*`, async context => {
    console.debug(`We should grab the person and the thing -- ${context.name} -- and add their name to the contributors file, .github/contri-credit.md`);
    if (context.name === 'push') {
      console.debug(JSON.stringify(context))
      console.debug(`${context.payload.pusher.name} just did a ${context.name}`); // We need to store this information for when we update the contents of contrib file
    }
    else if (context.name === 'create') {
      console.debug(JSON.stringify(context))
      console.debug(`${context.payload.sender.login} just did a ${context.name} AKA Pull Request`); // We need to store this information for when we update the contents of contrib file
    }
    else {
      console.debug(context)
    }
    /* 
    * Important Context Info
    * context.payload.ref == branch <-- lets us find the contrib file refrence
    * context.payload.repository.name == repo name <-- Def Need for calls
    * context.payload.repository.owner.name == owner name (rainrivas) <-- need for calls I think
    * context.payload.repository.owner.email == owner email (rainrivas@gmail.com)
    * context.payload.repository.owner.login == owner login (rainrivas) <-- or do I need for calls
    */
    let owner = context.payload.repository.owner.login,
      repo = context.payload.repository.name,
      path = '.github/dne.file',//'.github/contri-credit.md',
      ref = context.payload.ref

    // this returns an error if no file found : ERROR event: {"message":"Not Found","documentation_url":"https://developer.github.com/v3/repos/contents/#get-contents"}
    try {
      const result = await context.github.repos.getContent({ owner, repo, path, ref })
      console.debug(result.data.sha) // the sha of the found file
      // now we do update work with this, which we should probably also wrap into try-catch.. iunno.
      // const res = await context.github.repos.updateFile({ owner, repo, path, message, content, sha, branch }); // update a created file, branch (opt),
    } catch (error) {
      // Handle error when we can't get file
      console.error(error);
      // (if error has 404) const result = await context.github.repos.createFile({ owner, repo, path, message, content, branch, committer }); // create the file, branch (opt), committer (opt)

    }

    //   let owner = 'rainrivas',
    //     branch = 'test-branch2',
    //     // committer = { name: 'Efrain \'Rain\' Rivas', email: 'rainrivas@gmail.com' },
    //     // fileBody = '\nAdding new contribs to the magic file',//'c2FtcGxlIHRlc3QgZmlsZQ==',
    //     // message = 'Modifying contrib file',
    //     path = '.github/contri-credit.md',
    //     repo = 'probot-test-playground'
    //     // sha = 'ac85ae3242b0e7e1c9d69b6d33c1d382816f9dc9'; // currently this is hard coded, we need to make a GET action to figure out if this file exists to grab sha

    //   /* Get contents of the file
    //   * https://octokit.github.io/rest.js/#api-Repos-getContent
    //   * owner	string
    //   * repo	string
    //   * path	string The content path.
    //   * ref string (optional) The name of the commit/branch/tag. Default value: the repository’s default branch (usually `master`)
    //   */
    //  let ref = branch;
    //   const result = await context.github.repos.getContent({ owner, repo, path, ref })

    //   // Updating file based on info from github octokit
    //   // https://octokit.github.io/rest.js/#api-Repos-updateFile

    //   // file contents need to be encoding so doing that here
    //   // let buff = new Buffer(fileBody);
    //   // let content = buff.toString('base64');

    //   // Need to make the call to figure out if the file already exists and if it does we need to grab it's sha so we can pass it to the "udpate" file command.

    //   // await context.github.repos.createFile({ owner, repo, path, message, content, branch, committer }); // create the file
    //   // const res = await context.github.repos.updateFile({ owner, repo, path, message, content, sha, branch }); // update a created file


    //   return console.debug(result)

    //   // For more information on building apps:
    //   // https://probot.github.io/docs/

    //   // To get your app running against GitHub, see:
    //   // https://probot.github.io/docs/development/
  });
}
