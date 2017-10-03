const chai = require('chai');
const chalk = require('chalk');
const fs = require('fs');
const jsonfile = require('jsonfile');
const onesky = require('onesky-utils');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const deferred = Promise.defer();

const upload = require('../src/upload');

const fileName = locale => `${program.path || '.'}/${locale}.json`;

const {
  program,
  oneSkyReply,
  idFile1,
  idFile2,
  enFile1,
  enFile2
} = require('./test-data');

chai.use(sinonChai);
const expect = chai.expect;

describe('Upload', () => {
  let postFile;
  let readFileSync;
  let processExit;
  let deferStub;

  beforeEach(() => {
    sinon.stub(console, 'error');
    sinon.stub(console, 'warn');
    sinon.stub(console, 'info');

    postFile = sinon.stub(onesky, 'postFile');
    postFile.returns(Promise.resolve(oneSkyReply));

    readFileSync = sinon.stub(jsonfile, 'readFileSync');

    processExit = sinon.stub(process, 'exit');

    deferStub = sinon.stub(deferred, 'resolve').returns(Promise.resolve(oneSkyReply));
  });

  afterEach(() => {
    console.error.restore();
    console.warn.restore();
    console.info.restore();

    postFile.restore();
    readFileSync.restore();
    processExit.restore();
    deferStub.restore();
  });

  it('should prepare for uploading', (done) => {
    readFileSync.withArgs(fileName('en-US')).returns(enFile1);
    readFileSync.withArgs(fileName('id')).returns(idFile1);

    upload(program)
      .then(() => {
        expect(console.info).have.been.calledWith('Getting files from');
      })
      .then(done, done);
  });

  it('should exit when missing translation to upload', (done) => {
    readFileSync.withArgs(fileName('en-US')).returns(enFile1);
    readFileSync.withArgs(fileName('id')).returns(idFile1);

    upload(Object.assign({}, program, { fileName: undefined, locales: undefined }))
      .then(() => {
        expect(console.error).have.been.calledWith(chalk.red('    locales or fileName to upload should be defined'));
        expect(process.exit).have.been.calledWith(1);
      })
      .then(done, done);
  });

  it('should upload when fileName to upload exists', (done) => {
    readFileSync.withArgs(fileName('en-US')).returns(enFile1);

    upload(Object.assign({}, program, { fileName: 'en-US.json', locales: undefined }))
      .then(() => {
        expect(console.info.args[3][0]).to.be.equal(`  - ${program.path}/${program.fileName}.json -`);
        expect(console.info.args[3][1]).to.be.equal(chalk.green('Success!'));
      })
      .then(done, done);
  });

  it('should upload when locales to upload exists', (done) => {
    readFileSync.withArgs(fileName('en-US')).returns(enFile1);
    readFileSync.withArgs(fileName('id')).returns(enFile2);

    upload(Object.assign({}, program, { fileName: undefined, locales: 'en-US, id' }))
    .then(() => {
      const locale = program.locales.split(',');
      expect(console.info.args[3][0]).to.be.equal(`  - ${program.path}/${locale[0]}.json -`);
      expect(console.info.args[3][1]).to.be.equal(chalk.green('Success!'));
      expect(console.info.args[4][0]).to.be.equal(`  - ${program.path}/${locale[1]}.json -`);
      expect(console.info.args[4][1]).to.be.equal(chalk.green('Success!'));
    })
    .then(done, done);
  });
});