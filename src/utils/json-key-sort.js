/**
 * Sort object keys alphabetically.
 * Also sort the nested object.
 * Also sort array.
 */

function sort(obj) {
  if (Array.isArray(obj)) {
    return obj.sort();
  }

  const keys = Object.keys(obj);
  const newObj = {};

  keys.sort()
      .forEach((key) => {
        newObj[key] = typeof obj[key] === 'object' ? sort(obj[key]) : obj[key];
      });

  return newObj;
}

module.exports = sort;
