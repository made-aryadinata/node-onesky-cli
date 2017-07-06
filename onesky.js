#!/usr/bin/env node

const program = require('commander');

program
  .command('sync', 'Synchronize multilingual translations from OneSky')
  .command('upload', 'Upload multilingual translations to OneSky')
  .parse(process.argv);
