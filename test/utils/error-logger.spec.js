const chai = require('chai');
const chalk = require('chalk');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const errorLogger = require('../../src/utils/error-logger');

chai.use(sinonChai);
const { expect } = chai;

describe('Error logger', () => {
  beforeEach(() => {
    sinon.stub(console, 'error');
  });

  afterEach(() => {
    console.error.restore();
  });

  it('should log OneSky error', () => {
    errorLogger({ code: 404, message: 'Not found' });
    expect(console.error).to.be.calledWith(chalk.red('404: Not found'));
  });

  it('should log other errors', () => {
    errorLogger('other error');
    expect(console.error).to.be.calledWith(chalk.red('other error'));
  });
});
