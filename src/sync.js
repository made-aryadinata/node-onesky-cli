const chalk = require('chalk');
const fs = require('fs');
const jsonfile = require('jsonfile');
const onesky = require('onesky-utils');

const errorLogger = require('./utils/error-logger');
const jsonKeySort = require('./utils/json-key-sort');
const jsonKeyDiff = require('./utils/json-key-diff');

const sync = (program) => {
  const filePath = program.path || '.';

  const oneSkyGetOptions = {
    secret: program.secret,
    apiKey: program.apiKey,
    projectId: program.projectId,
    fileName: program.fileName,
    format: 'I18NEXT_MULTILINGUAL_JSON'
  };

  console.info(chalk.bold('Synchronizing translations with OneSky...'));
  console.info('\nDownloading...');

  return onesky.getMultilingualFile(oneSkyGetOptions).then((content) => {
    console.info(chalk.green('  Success!'));
    const parsedJson = JSON.parse(content);

    if (program.console) {
      console.info(content);
      console.info(chalk.green('Done!'));
      return;
    }

    let shouldFailProcess = false;
    console.info('\nComparing with local locale files...');
    Object.keys(parsedJson).forEach((locale) => {
      console.info(`  - ${locale}`);

      const { translation } = parsedJson[locale];
      Object.keys(translation).forEach((key) => {
        translation[key] = Array.isArray(translation[key]) ? translation[key].join('\n') : translation[key];
      });

      // TODO: check file exists
      const localJson = jsonfile.readFileSync(`${filePath}/${locale}.json`);
      const oneSkyJson = translation;
      const diffs = jsonKeyDiff(localJson, oneSkyJson);

      if (diffs[0].length === 0 && diffs[1].length === 0) {
        console.info(chalk.green('    Synced!'));
      }

      if (diffs[0].length > 0) {
        console.error(chalk.red('    Missing phrase in OneSky:', diffs[0]));

        if (!program.optimistic) {
          // if not optimistic, fail the process
          shouldFailProcess = true;
        }
      }

      if (diffs[1].length > 0) {
        console.warn(chalk.yellow('    Missing phrase in local:', diffs[1]));
      }
    });

    if (shouldFailProcess) {
      process.exit(1);
    }

    console.info('\nWriting to locale files...');
    Object.keys(parsedJson).forEach((locale) => {
      const fileName = `${filePath}/${locale}.json`;
      let translationToWrite = parsedJson[locale].translation;

      if (program.optimistic && fs.existsSync(fileName)) {
        const previousJson = jsonfile.readFileSync(fileName);
        translationToWrite = Object.assign(
          translationToWrite,
          previousJson
        );
      }

      jsonfile.writeFileSync(fileName, jsonKeySort(translationToWrite), { spaces: 2 });
      console.info(`  - ${fileName} -`, chalk.green('done!'));
    });
  }).catch(errorLogger);
};

module.exports = sync;
