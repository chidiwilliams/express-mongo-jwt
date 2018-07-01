const config = {
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/express-mongo-jwt',
  PORT: process.env.PORT || 3000,
  APP_SECRET: process.env.APP_SECRET || 'thisismysecretkey',
};

module.exports = config;
