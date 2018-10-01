const headerTemplate = (userCount) => {
  return `# Contributors\n### This open source project was made with ❤️ by ${userCount} users!\n`;
};

const userTemplate = (contributions, url, user) => {
  return `* [${user}](${url}) - ${contributions}\n`;
};
module.exports = {
  headerTemplate,
  userTemplate
};
