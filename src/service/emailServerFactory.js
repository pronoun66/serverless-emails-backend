const MailgunEmailServer = require('./emailServer/mailgunEmailServer');
const SendgridEmailServer = require('./emailServer/sendgridEmailServer');
const emailServerStatus = require('../const/emailServerStatus');
const emailServerList = require('../const/emailServerId');
const emailServerTable = require('../db/emailServerTable');

const list = {
  [emailServerList.MAILGUN]: MailgunEmailServer,
  [emailServerList.SENDGRID]: SendgridEmailServer,
};

const getEmailServer = (emailServerId) => {
  const SelectedEmailServer = list[emailServerId];

  if (!SelectedEmailServer) {
    throw new Error('Unsupported Email Server');
  }

  return new SelectedEmailServer();
};

const getAvailableEmailServer = async () => {
  const availableEmailServers = await emailServerTable
    .listEmailServer({ status: emailServerStatus.AVAILABLE });

  if (availableEmailServers.length === 0) {
    throw new Error('No active email servers');
  }

  const selectedIndex = Math.floor(Math.random() * availableEmailServers.length);

  return getEmailServer(availableEmailServers[selectedIndex].id);
};

module.exports = {
  getEmailServer,
  getAvailableEmailServer,
};
