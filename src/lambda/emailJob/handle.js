const emailJobTable = require('../../db/emailJobTable');
const emailServerFactory = require('../../service/emailServerFactory');
const emailJobStatus = require('../../const/emailJobStatus');
const logger = require('../../utils/logger');
const { flattenObj } = require('../../utils/dynamoDB');


const shouldRun = (event) => {
  if (event.eventSource !== 'aws:dynamodb') {
    return false;
  }

  if (event.eventName !== 'INSERT' && event.eventName !== 'MODIFY') {
    return false;
  }

  const status = (event.dynamodb.NewImage.status || {}).S;
  if (status !== emailJobStatus.NEW) {
    return false;
  }

  return true;
};

const handleSingleEvent = async (event) => {
  let jobId;
  try {
    if (!shouldRun(event)) {
      return;
    }

    const { params: { M: params } } = event.dynamodb.NewImage;
    const emailBody = flattenObj(params);
    jobId = event.dynamodb.Keys.id.S;
    const emailServer = await emailServerFactory.getAvailableEmailServer();
    await emailServer.sendEmail(emailBody);
    await emailJobTable.updateEmailJob({ id: jobId, status: emailJobStatus.DONE });
  } catch (e) {
    logger.info(`Can't handle job=${jobId}, ${e.message}`);
    await emailJobTable.updateEmailJob({ id: jobId, status: emailJobStatus.FAILED });
  }
};

/**
 * Process email jobs
 * @param event
 * @returns {Promise<undefined[]>}
 */
const handler = async event => Promise.all(event.Records.map(record => handleSingleEvent(record)));

module.exports = {
  handler,
};
