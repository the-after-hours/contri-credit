import { Application } from 'probot'
import axios from 'axios'

export = (app: Application) => {
  // Your code here
  app.log('Yay, the app was loaded!')
  // app.on(['push','issue.opened'], async context => {
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

    // throwing these into comments until i get things working
    let options = {
      baseURL: 'https://api.github.com/',
      method: 'PUT',
      url: `/repos/rainrivas/probot-test-playground/contents/.github/contri-credit.md`,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'User-Agent': 'the-after-hours',
        'Authorization': `${process.env.WEBHOOK_SECRET}`
      },
      body:
      {
        message: 'Creating the contrib file',
        content: 'c2FtcGxlIHRlc3QgZmlsZQ==',
        commiter: { name: 'Efrain \'Rain\' Rivas', email: 'rainrivas@gmail.com' },
        branch: 'test-branch2'
      },
      json: true
    };


    /* 
    Run the GET first and see if the file exists
    If file not found we should create it (PUT)
    If it does, we should update it (PUT but with the "SHA" param)
    */
    // This doesn't work yet so comments
    axios(options)
      .catch(function (error) {
        console.info(`we goofed`);
        console.error(error);
      })
      .then(function (response) {
        console.info('Reponse received.');
        console.info(response);
      });

    // https://developer.github.com/v3/repos/contents/#update-a-file
    // PUT /repos/:owner/:repo/contents/:path
    // https://api.github.com

    /* Using wildcard event to catch anything our app already listens to
     app.on(`*`, async context => {
      context.log({event: context.event, action: context.payload.action})
    })
    */

    // For more information on building apps:
    // https://probot.github.io/docs/

    // To get your app running against GitHub, see:
    // https://probot.github.io/docs/development/
  });
}
