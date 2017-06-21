#!/usr/bin/env node

/**
 * Sync translation from OneSky in I18next multilingual json format
 * - Exists in OneSky, not in Git: use OneSky
 * - Exists in both, value is different: use OneSky
 * - Exists in Git, not in OneSky:
 *   - optimistic=true: merge them, log the missing translation
 *   - optimistic=false: throw error
 */

const program = require('commander');
const sync = require('./src/sync');

program
  .option('-p, --path [path]', 'Directory path to save translation files')
  .option('-o, --optimistic', 'If missing in OneSky, use local translation files')
  .option('-c, --console', 'Write to standard output only')
  .option('-s, --secret <secret>', 'OneSky secret key')
  .option('-a, --apiKey <apiKey>', 'OneSky API key')
  .option('-i, --projectId <projectId>', 'OneSky project ID')
  .option('-n, --fileName <fileName>', 'OneSky file name');

program.parse(process.argv);

sync(program);
