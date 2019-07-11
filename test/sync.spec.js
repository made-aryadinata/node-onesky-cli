const chai = require('chai');
const chalk = require('chalk');
const fs = require('fs');
const jsonfile = require('jsonfile');
const onesky = require('onesky-utils');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const sync = require('../src/sync');

const {
  program,
  oneSkyReply,
  idFile1,
  idFile2,
  enFile1,
  enFile2
} = require('./test-data');


chai.use(sinonChai);
const { expect } = chai;

const fileName = locale => `${program.path || '.'}/${locale}.json`;

describe('Sync', () => {
  let getMultilingualFile;
  let readFileSync;
  let writeFileSync;
  let existsSync;
  let processExit;

  beforeEach(() => {
    sinon.stub(console, 'error');
    sinon.stub(console, 'warn');
    sinon.stub(console, 'info');

    getMultilingualFile = sinon.stub(onesky, 'getMultilingualFile');
    getMultilingualFile.returns(Promise.resolve(oneSkyReply));

    readFileSync = sinon.stub(jsonfile, 'readFileSync');
    writeFileSync = sinon.stub(jsonfile, 'writeFileSync');

    existsSync = sinon.stub(fs, 'existsSync');

    processExit = sinon.stub(process, 'exit');
  });

  afterEach(() => {
    console.error.restore();
    console.warn.restore();
    console.info.restore();

    getMultilingualFile.restore();
    readFileSync.restore();
    writeFileSync.restore();
    existsSync.restore();
    processExit.restore();
  });

  it('should console.info \'Synced!\' when translations already in sync', (done) => {
    readFileSync.withArgs(fileName('en-US')).returns(enFile1);
    readFileSync.withArgs(fileName('id')).returns(idFile1);

    sync(program)
      .then(() => {
        expect(console.info).have.been.calledWith(chalk.green('    Synced!'));
      })
      .then(done, done);
  });

  it('should console.error if there are any missing translations from OneSky', (done) => {
    readFileSync.withArgs(fileName('en-US')).returns(enFile2);
    readFileSync.withArgs(fileName('id')).returns(idFile2);

    sync(program)
      .then(() => {
        expect(console.error).have.been.calledWith(chalk.red('    Missing phrase in OneSky: water'));
      })
      .then(done, done);
  });

  it('should console.warn if there are any missing translations in local file', (done) => {
    readFileSync.withArgs(fileName('en-US')).returns({});
    readFileSync.withArgs(fileName('id')).returns({});

    sync(program)
      .then(() => {
        expect(console.warn).have.been.calledWith(chalk.yellow('    Missing phrase in local: test'));
      })
      .then(done, done);
  });

  it('should exit when not optimistic and missing translation from OneSky', (done) => {
    readFileSync.withArgs(fileName('en-US')).returns(enFile2);
    readFileSync.withArgs(fileName('id')).returns(idFile2);

    sync(Object.assign({}, program, { optimistic: false }))
      .then(() => {
        expect(console.error).have.been.calledWith(chalk.red('    Missing phrase in OneSky: water'));
        expect(process.exit).have.been.calledWith(1);
      })
      .then(done, done);
  });

  it('should merge translation in local file and OneSky when optimistic and file exists', (done) => {
    readFileSync.withArgs(fileName('en-US')).returns(enFile2);
    readFileSync.withArgs(fileName('id')).returns(idFile2);

    existsSync.returns(true);

    sync(program)
      .then(() => {
        expect(console.error).have.been.calledWith(chalk.red('    Missing phrase in OneSky: water'));
      })
      .then(done, done);
  });

  it('should print \'Done!\' when console is true', (done) => {
    sync(Object.assign({}, program, { console: true }))
      .then(() => {
        expect(console.info).have.been.calledWith(chalk.green('Done!'));
      })
      .then(done, done);
  });
});
