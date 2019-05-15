const emailJobTable = require('../../db/emailJobTable');
const logger = require('../../utils/logger');
const response = require('../../utils/response');
const validate = require('../../utils/validate');
const schema = require('./schema/create');

/**
 * Create email jobs in db
 * @param event {
 *   body: {
 *     from,
 *     to,
 *     subject,
 *     content
 *   }
*   }
 * @returns {Promise<*>}
 */
const handler = async (event) => {
  let params;
  try {
    logger.info(JSON.stringify(event, null, 2));
    const body = event.body ? JSON.parse(event.body) : null;
    validate({ ...event, body }, schema);
    params = body;
  } catch (e) {
    return response.badRequest({ message: `Cannot send email. ${e.message}` });
  }

  try {
    await emailJobTable.createEmailJob(params);
  } catch (e) {
    logger.error(e);
    return response.internalServerError({ message: 'Cannot send the email' });
  }

  return response.ok({ message: 'Sending email is in process' });
};

module.exports = {
  handler,
};
