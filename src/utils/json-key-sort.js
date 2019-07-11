/**
 * Sort object keys alphabetically.
 * Also sort the nested object.
 * Also sort array.
 */

const compare = (a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' });

function sort(obj) {
  if (Array.isArray(obj)) {
    return obj.sort(compare);
  }

  const keys = Object.keys(obj);
  const newObj = {};

  keys.sort(compare)
    .forEach((key) => {
      newObj[key] = typeof obj[key] === 'object' ? sort(obj[key]) : obj[key];
    });

  return newObj;
}

module.exports = sort;
