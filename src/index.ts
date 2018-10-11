import { Application } from 'probot'

/* Majority of this is using the octokit to interact with GH API 
* https://octokit.github.io/rest.js/
*/
export = (app: Application) => {
  let updateMessage = ''
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
      updateMessage = `${context.payload.pusher.name} just did a ${context.name}`
    }
    else if (context.name === 'create') {
      console.debug(JSON.stringify(context))
      console.debug(`${context.payload.sender.login} just did a ${context.name} AKA Pull Request`); // We need to store this information for when we update the contents of contrib file
      updateMessage = `${context.payload.sender.login} just did a ${context.name} AKA Pull Request`
    }
    else {
      console.debug(JSON.stringify(context))
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
      // todo: test writing to files the bot should not be able to access
      path = '.github/contri-credit.md',
      ref = context.payload.ref
    let branch = ref // Have to do this becaues the createFile method doens't like having branch be set to 'ref'

    // this returns an error if no file found : ERROR event: {"message":"Not Found","documentation_url":"https://developer.github.com/v3/repos/contents/#get-contents"}
    try {
      const getFile = await context.github.repos.getContent({ owner, repo, path, ref })
      console.debug(JSON.stringify(getFile)) // the sha of the found file
      var content64 = getFile.data.content,
      sha = getFile.data.sha
    } catch (error) {
      // Handle error when we can't get file
      console.error(error);
      if (error.code === 404) {
        console.debug('404 means it is time to make it happen capn');
        let fileBody = '\nAdding new contribs to the magic file', // eventually add the info from app.on(*) if-else blocks
          message = 'Creating contrib file' // This is the commit message we'll be seeing
        //  file contents need to be encoding so doing that here
        let buff = new Buffer(fileBody);
        let content = buff.toString('base64');
        // eventually all these context.github calls should probably be wrapped in a try catch of their own
        const createContrib = await context.github.repos.createFile({ owner, repo, path, message, content, branch, /*committer*/ }); // create the file, branch (opt), committer (opt)--if left blank is commiter the bot?
        console.debug(createContrib.status) // should be a 201
      }
    }
    if (sha) { // if we do have a sha, lets update this bad boy
      try {
        // now we do update work with this, which we should probably also wrap into try-catch.. iunno.
        let oldContent = new Buffer(content64,'base64').toString('ascii')
        let updateBuff = new Buffer(oldContent + '<br>' + updateMessage)
        let content = updateBuff.toString('base64'),
          message = 'Updating contrib file with new user contribution'
        // todo: When updating the file, we should make a call to the contributors part of the context so we can add totals up
        // body: Use the contributors call -- https://octokit.github.io/rest.js/#api-Repos-getContributors -- const result = await octokit.repos.getContributors({owner, repo, anon, per_page, page})
        const updateFile = await context.github.repos.updateFile({ owner, repo, path, message, content, sha, branch }); // update a created file, branch (opt),
        console.debug(updateFile.status)
      } catch (error) {
        console.error(error);
      }
    }

    //   // For more information on building apps:
    //   // https://probot.github.io/docs/

    //   // To get your app running against GitHub, see:
    //   // https://probot.github.io/docs/development/
  });
}
