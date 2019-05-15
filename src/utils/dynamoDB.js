const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const { dynamodb } = require('../config/test');

let options = {};

// connect to local DB if running offline
if (process.env.IS_OFFLINE) {
  options = dynamodb;
}

const dynamoDB = new AWS.DynamoDB.DocumentClient(options);


// e.g. {"to": { "S": "jerry@gmai.com" }} becomes {"to": "jerry@gmai.com"}
const flattenObj = (dynamoObj) => {
  if (typeof dynamoObj === 'undefined') {
    return {};
  }

  return Object.keys(dynamoObj).reduce((acc, k) => {
    const currentObj = dynamoObj[k];
    const firstKey = Object.keys(currentObj)[0];
    const value = firstKey === 'M' ? flattenObj(currentObj[firstKey]) : currentObj[firstKey];
    return Array.isArray(acc) ? acc.concat(value) : { ...acc, ...{ [k]: value } };
  }, Array.isArray(dynamoObj) ? [] : {});
};

module.exports = {
  dynamoDB,
  flattenObj,
};
