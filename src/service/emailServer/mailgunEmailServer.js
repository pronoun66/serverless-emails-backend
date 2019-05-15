const fetch = require('node-fetch');
const FormData = require('form-data');
const AbstractEmailServer = require('./abstractEmailServer');
const emailServerList = require('../../const/emailServerId');
const emailServerStatus = require('../../const/emailServerStatus');
const logger = require('../../utils/logger');
const { mailgun } = require('../../config');


class MailgunEmailServer extends AbstractEmailServer {
  constructor() {
    super(emailServerList.MAILGUN, 'Mailgun');
  }

  async sendEmail({
    from, to, subject, content,
  }) {
    const form = new FormData();
    form.append('from', from);
    form.append('to', to);
    form.append('subject', subject);
    form.append('text', content);

    const requestObject = {
      method: 'POST',
      body: form,
    };

    const url = `https://${mailgun.auth}@${mailgun.url}/messages`;
    logger.info(`Request ${url}`);

    try {
      const res = await fetch(url, requestObject);
      const body = await res.text();
      logger.info(`Response ${res.status} ${body}`);

      if (res.status >= 500) {
        throw new Error(JSON.stringify(body));
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

module.exports = MailgunEmailServer;
