const chai = require('chai');

const jsonKeySort = require('../../src/utils/json-key-sort');

const expect = chai.expect;

describe('JSON key sort', () => {
  it('should return the object with sorted keys', () => {
    const objectA = {
      b: '',
      c: '',
      a: { e: '', f: '', d: '' },
      d: ['c', 'a', 'b']
    };

    const sortedObjectA = jsonKeySort(objectA);
    expect(Object.keys(sortedObjectA)).to.not.deep.equal(['b', 'c', 'a', 'd']);
    expect(Object.keys(sortedObjectA)).to.deep.equal(['a', 'b', 'c', 'd']);

    expect(Object.keys(sortedObjectA.a)).to.not.deep.equal(['e', 'f', 'd']);
    expect(Object.keys(sortedObjectA.a)).to.deep.equal(['d', 'e', 'f']);

    expect(sortedObjectA.d).to.not.deep.equal(['c', 'a', 'b']);
    expect(sortedObjectA.d).to.deep.equal(['a', 'b', 'c']);
  });
});
