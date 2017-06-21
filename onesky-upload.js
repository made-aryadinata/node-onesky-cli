#!/usr/bin/env node

/**
 * Upload translation in I18next multilingual json format
 */

const chalk = require('chalk');
const fs = require('fs');
const jsonfile = require('jsonfile');
const onesky = require('onesky-utils');
const program = require('commander');

const errorLogger = require('./utils/error-logger');

program
  .option('-p, --path [path]', 'Directory path to save translation files')
  .option('-l, --locales [locales...]', 'List of locales to upload, separated by comma')
  .option('-s, --secret <secret>', 'OneSky secret key')
  .option('-a, --apiKey <apiKey>', 'OneSky API key')
  .option('-i, --projectId <projectId>', 'OneSky project ID')
  .option('-n, --fileName <fileName>', 'OneSky file name');

program.parse(process.argv);

const filePath = program.path || '.';

let uploadedLocales = program.locales && program.locales.split(',');
console.log('Getting files from', filePath);
if (!uploadedLocales) {
  uploadedLocales = fs.readdirSync(filePath)
    .filter(file => file.slice(-5) === '.json')
    .map(file => file.slice(0, -5));
}
console.log('Locale to upload:', uploadedLocales);

const content = {};

uploadedLocales.forEach((locale) => {
  const localeJson = jsonfile.readFileSync(`${filePath}/${locale}.json`);
  content[locale] = { translation: localeJson };
});

const oneSkyPostOptions = {
  keepStrings: true,
  allowSameAsOriginal: false,
  secret: program.secret,
  apiKey: program.apiKey,
  projectId: program.projectId,
  fileName: program.fileName,
  format: 'I18NEXT_MULTILINGUAL_JSON',
  language: 'en-US',
  content: JSON.stringify(content)
};

console.log(chalk.bold('Uploading...'));
onesky.postFile(oneSkyPostOptions).then((content) => {
  console.log(chalk.green('Success!'));
  console.log(JSON.parse(content));
}).catch(errorLogger);

