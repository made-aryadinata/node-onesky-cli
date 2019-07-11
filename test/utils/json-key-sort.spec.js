const chai = require('chai');

const jsonKeySort = require('../../src/utils/json-key-sort');

const { expect } = chai;

describe('JSON key sort', () => {
  it('should return the object with sorted keys', () => {
    const objectA = {
      b: '',
      C: '',
      a: { E: '', f: '', d: '' },
      D: ['c', 'a', 'B']
    };

    const sortedObjectA = jsonKeySort(objectA);
    expect(Object.keys(sortedObjectA)).to.not.deep.equal(['b', 'C', 'a', 'D']);
    expect(Object.keys(sortedObjectA)).to.deep.equal(['a', 'b', 'C', 'D']);

    expect(Object.keys(sortedObjectA.a)).to.not.deep.equal(['E', 'f', 'd']);
    expect(Object.keys(sortedObjectA.a)).to.deep.equal(['d', 'E', 'f']);

    expect(sortedObjectA.D).to.not.deep.equal(['c', 'a', 'B']);
    expect(sortedObjectA.D).to.deep.equal(['a', 'B', 'c']);
  });
});
