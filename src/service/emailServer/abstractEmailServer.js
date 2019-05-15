const { updateEmailServer } = require('../../db/emailServerTable');
const logger = require('../../utils/logger');

class AbstractEmailServer {
  constructor(id = '111', name = 'name') {
    this.id = id;
    this.name = name;
  }

  sendEmail() {
    throw new Error('Unsupported');
  }

  async updateStatus(status) {
    try {
      await updateEmailServer({ id: this.id, status });
    } catch (e) {
      logger.error(e.message);
    }
  }
}

module.exports = AbstractEmailServer;
