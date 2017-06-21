/**
 * Function to check key exist in one json but not in other.
 */
const only = (json, otherJson) => {
  return Object.keys(json).reduce((acc, key) => {
    if (otherJson[key] === undefined) {
      acc.push(key);
    }
    return acc;
  }, []);
};

/**
 * Function to check key difference between two json.
 * This function does not check the value.
 * Returns an array with length 2,
 * the first value is what exists in json but not in otherJson,
 * and otherwise for second value.
 */
const diff = (json, otherJson) => {
  // TODO: nested object
  return [only(json, otherJson), only(otherJson, json)];
};

module.exports = diff;
