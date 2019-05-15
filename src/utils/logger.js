

const logger = {
  info: (...args) => {
    if (!process.env.IS_TEST) {
      console.info.apply(null, args); // eslint-disable-line
    }
  },
  error: (...args) => {
    console.error.apply(null, args); // eslint-disable-line
  },
};

module.exports = logger;
