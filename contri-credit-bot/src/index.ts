import { Application } from 'probot'

export = (app: Application) => {
  // Your code here
  app.log('Yay, the app was loaded!')
  // app.on(['push','issue.opened'], async context => {
  app.on(`*`, async context => {
    console.log(`We should grab the person and the thing -- ${context.name} -- and add their name to the contributors file, .github/contri-credit.md`);
    if (context.name === 'push'){
      console.log(`${context.payload.pusher.name} just did a ${context.name}`);
    }
  });

  /* Using wildcard event to catch anything our app already listens to
   app.on(`*`, async context => {
    context.log({event: context.event, action: context.payload.action})
  })
  */

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
