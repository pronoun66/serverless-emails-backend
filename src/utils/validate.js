const Ajv = require('ajv');

const ajv = new Ajv({
  coerceTypes: true,
});

const validate = (data, schema) => {
  const validator = ajv.compile(schema);
  const valid = validator(data);

  if (!valid) {
    throw validator.errors[0];
  }

  return true;
};

module.exports = validate;
