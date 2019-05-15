const uuid = require('uuid');
const { dynamoDB } = require('../utils/dynamoDB');
const emailJobStatus = require('../const/emailJobStatus');

const createEmailJob = async (email) => {
  const timestamp = new Date().getTime();

  const params = {
    TableName: process.env.TABLE_EMAIL_JOB,
    Item: {
      id: email.id || uuid.v1(),
      params: email,
      status: emailJobStatus.NEW,
      createdAt: timestamp,
      updatedAt: timestamp,
      times: 0,
    },
  };

  return dynamoDB.put(params).promise();
};

const updateEmailJob = async ({ id, status }) => {
  const timestamp = new Date().getTime();

  const params = {
    TableName: process.env.TABLE_EMAIL_JOB,
    Key: {
      id,
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':status': status,
      ':updatedAt': timestamp,
      ':one': 1,
    },
    UpdateExpression: 'SET #status = :status, times = times + :one, updatedAt = :updatedAt',
  };

  await dynamoDB.update(params).promise();
};

module.exports = {
  createEmailJob,
  updateEmailJob,
};
