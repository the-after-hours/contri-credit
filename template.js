const headerTemplate = users => {
  return `# Contributors\n### This project was made with ❤️ by ${users.length} users!\n`;
};

const userTemplate = (contributions, url, user) => {
  return `* <a href="${url}">${user}</a> - ${contributions}\n`;
};
module.exports = {
  headerTemplate,
  userTemplate
};
