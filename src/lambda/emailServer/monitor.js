const emailServerStatus = require('../../const/emailServerStatus');
const emailServerTable = require('../../db/emailServerTable');
const emailServerFactory = require('../../service/emailServerFactory');
const logger = require('../../utils/logger');

/**
 * Check unavailable email server's healthy
 * @returns {Promise<void>}
 */
const handler = async () => {
  try {
    const unavailableEmailServers = await emailServerTable
      .listEmailServer({ status: emailServerStatus.UNAVAILABLE });

    Object.values(unavailableEmailServers).forEach(async (emailServerData) => {
      const emailServer = emailServerFactory.getEmailServer(emailServerData.id);
      if (await emailServer.healthCheck()) {
        await emailServer.updateStatus(emailServerStatus.AVAILABLE);
      }
    });
  } catch (e) {
    logger.error(`Monitoring error, ${e.message}`);
  }
};


module.exports = {
  handler,
};
