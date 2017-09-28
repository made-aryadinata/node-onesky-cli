#!/usr/bin/env node

/**
 * Upload translation in I18next multilingual json format
 */
const program = require('commander');

const upload = require('./src/upload');

program
  .option('-p, --path [path]', 'Directory path to save translation files')
  .option('-l, --locales [locales...]', 'List of locales to upload, separated by comma')
  .option('-s, --secret <secret>', 'OneSky secret key')
  .option('-a, --apiKey <apiKey>', 'OneSky API key')
  .option('-i, --projectId <projectId>', 'OneSky project ID')
  .option('-n, --fileName <fileName>', '<Optional> OneSky file name');

program.parse(process.argv);

upload(program);
