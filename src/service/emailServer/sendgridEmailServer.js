const fetch = require('node-fetch');
const AbstractEmailServer = require('./abstractEmailServer');
const emailServerList = require('../../const/emailServerId');
const emailServerStatus = require('../../const/emailServerStatus');
const logger = require('../../utils/logger');
const { sendgrid } = require('../../config');

class SendgridEmailServer extends AbstractEmailServer {
  constructor() {
    super(emailServerList.SENDGRID, 'Sendgrid');
  }

  async sendEmail({
    from, to, subject, content,
  }) {
    const requestObject = {
      method: 'POST',
      headers: {
        authorization: `Bearer ${sendgrid.apikey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
          subject,
        }],
        content: [{
          type: 'text/plain',
          value: content,
        }],
        from: {
          email: from,
        },
      }),
    };

    const url = `${sendgrid.url}/mail/send`;
    logger.info(`Request ${url}`);

    try {
      const res = await fetch(url, requestObject);
      logger.info(`Response ${res.status}`);

      if (res.status >= 500) {
        throw new Error('Email couldn\'t be sent');
      }
    } catch (e) {
      logger.error(`Caught error: ${e.message} in ${url} with ${requestObject}`);
      await this.updateStatus(emailServerStatus.UNAVAILABLE);
      throw e;
    }
  }

  async healthCheck() {
    // TODO
    return true;
  }
}

module.exports = SendgridEmailServer;
