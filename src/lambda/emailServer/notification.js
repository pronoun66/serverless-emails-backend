const emailServerStatus = require('../../const/emailServerStatus');
const logger = require('../../utils/logger');
const emailServerTable = require('../../db/emailServerTable');

/**
 * Notify when no email server is available
 * @param event
 * @returns {boolean}
 */
const shouldRun = (event) => {
  if (event.eventSource !== 'aws:dynamodb') {
    return false;
  }

  if (event.eventName !== 'MODIFY') {
    return false;
  }

  const status = (event.dynamodb.NewImage.status || {}).S;
  if (status !== emailServerStatus.UNAVAILABLE) {
    return false;
  }

  return true;
};

const handleSingleEvent = async (event) => {
  try {
    if (!shouldRun(event)) {
      return;
    }

    const availableEmailServers = await emailServerTable
      .listEmailServer({ status: emailServerStatus.AVAILABLE });

    // TODO send SNS
    if (availableEmailServers.length === 0) {
      logger.info('Notification sent sns');
    }
  } catch (e) {
    logger.error(`Notification error, ${e.message}`);
  }
};

const handler = async event => Promise.all(event.Records.map(record => handleSingleEvent(record)));

module.exports = {
  handler,
};
