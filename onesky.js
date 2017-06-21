#!/usr/bin/env node

const program = require('commander');

program
  .command('sync', 'Synchronize multilingual translations from OneSky')
  .parse(process.argv);
