
const chalk = require('chalk');
const fs = require('fs');
const jsonfile = require('jsonfile');
const onesky = require('onesky-utils');

const errorLogger = require('./utils/error-logger');

const generateOneSkyOptions = (program, fileName, fileContent) => ({
  keepStrings: true,
  allowSameAsOriginal: false,
  secret: program.secret,
  apiKey: program.apiKey,
  projectId: program.projectId,
  fileName,
  format: 'I18NEXT_MULTILINGUAL_JSON',
  language: 'en-US',
  content: JSON.stringify(fileContent)
});

const upload = (program) => {
  let shouldFailProcess = false;

  const filePath = program.path || '.';
  const content = {};
  const filesNameToUpload = [];

  let uploadedLocales = program.locales && program.locales.split(',');
  console.info('Getting files from');

  if (!uploadedLocales) {
    uploadedLocales = fs.readdirSync(filePath)
      .filter(file => file.slice(-5) === '.json')
      .map(file => file.slice(0, -5));
  }
  console.info('Locale to upload:', uploadedLocales);

  console.info(chalk.bold('Uploading...'));

  uploadedLocales.forEach((locale) => {
    const localeToUpload = locale.trim();
    const localeJson = jsonfile.readFileSync(`${filePath}/${localeToUpload}.json`);
    content[localeToUpload] = { translation: localeJson };

    if (!program.fileName) {
      filesNameToUpload.push(`${localeToUpload}.json`);
    }
  });

  if (filesNameToUpload.length === 0 && program.fileName) {
    filesNameToUpload.push(program.fileName);
  }

  if (filesNameToUpload.length === 0) {
    shouldFailProcess = true;
  }

  if (shouldFailProcess) {
    console.error(chalk.red('    locales or fileName to upload should be defined'));
    process.exit(1);
  }

  const promises = filesNameToUpload.map((fileNameToUpload) => {
    const oneSkyPostOptions = generateOneSkyOptions(program, fileNameToUpload, content);

    return onesky.postFile(oneSkyPostOptions);
  });

  return Promise.all(promises).then((results) => {
    results.forEach((result, index) => {
      console.info(`  - ${filePath}/${filesNameToUpload[index]} -`, chalk.green('Success!'));
    });
  }).catch(errorLogger);
};

module.exports = upload;
