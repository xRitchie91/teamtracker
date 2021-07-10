module.exports = function(obj, ...properties) {
  const errors = [];

  properties.forEach(property => {

    // if the property is blank or doesn't exist, add to the errors array
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