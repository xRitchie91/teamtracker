module.exports = function(obj, ...properties) {
  const errors = [];

  properties.forEach(property => {

    // adds to error array if property non-existent
    if (obj[property] === undefined || obj[property] === '') {
      errors.push(`No ${property} specified.`);
    }
  });

  if (errors.length) {
    return {
      error: errors.join(' ')
    };
  }
  return null;
};