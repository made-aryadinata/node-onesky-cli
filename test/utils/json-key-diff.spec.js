const chai = require('chai');

const jsonKeyDiff = require('../../src/utils/json-key-diff');

const { expect } = chai;

describe('JSON key diff', () => {
  it('should return the difference', () => {
    const objectA = { a: 'a', b: 'b' };
    const objectB = { b: 'b', c: 'c' };

    expect(jsonKeyDiff(objectA, objectB)).to.deep.equal([['a'], ['c']]);
  });
});
