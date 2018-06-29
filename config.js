const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/express-mongo-jwt',
  port: process.env.PORT || 3000,
  appSecret: process.env.APP_SECRET || 'thisismysecretkey',
};

module.exports = config;
