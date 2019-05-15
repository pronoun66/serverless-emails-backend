const { dynamoDB } = require('../utils/dynamoDB');

const listEmailServer = async ({ status }) => {
  const params = {
    TableName: process.env.TABLE_EMAIL_SERVER,
    FilterExpression: '#status = :status',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':status': status,
    },
  };

  const result = await dynamoDB.scan(params).promise();
  return result.Items ? result.Items : [];
};

const updateEmailServer = async ({ id, status }) => {
  const params = {
    TableName: process.env.TABLE_EMAIL_SERVER,
    Key: {
      id,
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':status': status,
      ':updatedAt': new Date().getTime(),
    },
    UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
  };

  await dynamoDB.update(params).promise();
};

module.exports = {
  listEmailServer,
  updateEmailServer,
};
